const Joi = require('joi');
const { Database } = require('sqlite3');
const EventStore = require('../../stores/eventStore');
const ReportCache = require('../../stores/reportCache');
const ReportBuilder = require('../../reporting/reportBuilder');
const skuSchema = require('./skuSchema');

/* eslint-disable no-param-reassign, no-underscore-dangle */

// http://www.jacklmoore.com/notes/rounding-in-javascript/
const truncate = (num, places = 2) =>
    Number(Math.trunc(num + 'e' + places) + 'e-' + places);
const round = (num, places = 2) => {
    const rounded = Number(Math.round(num + 'e' + places) + 'e-' + places);
    return truncate(rounded);
};

class SkuService {
    constructor(sqliteDbFileName) {
        const db = new Database(sqliteDbFileName);
        this.eventStore = new EventStore(db);
        const reportCache = new ReportCache(db);
        this.reportBuilder = new ReportBuilder(this.eventStore, reportCache);
    }

    createSku(sku) {
        const result = Joi.validate(sku, skuSchema);
        if (result.error) throw new Error(result.error.message);
        const validatedSku = result.value;
        return this.eventStore.saveEvent({
            type: 'SKU_ADDED',
            namespace: 'inventory',
            entityType: 'Sku',
            entityId: validatedSku.sku,
            body: validatedSku,
        });
    }

    getSku(skuId) {
        return this.buildSkuReport()
            .then(report => (report.body.skus || {})[skuId]);
    }

    buildSkuReport() {
        const eventsFilter = {
            entityType: 'Sku',
        };
        return this.reportBuilder.buildReport('skuReport', eventsFilter, (reportBody, event) => {
            const sku = event.body;

            if (!reportBody.skus) reportBody.skus = {};

            const remainingQuantity = sku.startingQuantity -
                sku.consumedQuantity -
                sku.spoiledQuantity -
                sku.shrankQuantity;
            const skuReport = Object.assign({}, sku, {
                _bookValue: round(sku.unitCost * remainingQuantity),
            });

            reportBody.skus[sku.sku] = skuReport;

            if (!reportBody.totalValue) reportBody.totalValue = 0;
            reportBody.totalValue = round(reportBody.totalValue + skuReport._bookValue);

            if (!reportBody.totalStartingValue) reportBody.totalStartingValue = 0;
            const startingValue = round(skuReport.startingQuantity * skuReport.unitCost);
            reportBody.totalStartingValue = round(reportBody.totalStartingValue + startingValue);

            if (!reportBody.totalConsumedValue) reportBody.totalConsumedValue = 0;
            const consumedValue = round(skuReport.consumedQuantity * skuReport.unitCost);
            reportBody.totalConsumedValue = round(reportBody.totalConsumedValue + consumedValue);

            if (!reportBody.totalSpoiledValue) reportBody.totalSpoiledValue = 0;
            const spoiledValue = round(skuReport.spoiledQuantity * skuReport.unitCost);
            reportBody.totalSpoiledValue = round(reportBody.totalSpoiledValue + spoiledValue);

            return reportBody;
        });
    }
}

module.exports = SkuService;
