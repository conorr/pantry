const { Database } = require('sqlite3');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const SkuService = require('../../../../src/services/skuService');
const { setUpDatabase, truncateTables } = require('../../utils');
const inventory = require('./inventory');

chai.use(chaiAsPromised);
chai.expect();
const { expect } = chai;

/* eslint-disable no-undef, object-curly-newline, no-unused-expressions */

describe('SkuService', () => {
    let db;
    let service;

    before((done) => {
        service = new SkuService('pantry.db');
        db = new Database('pantry.db');
        setUpDatabase(db).then(done).catch(err => done(err));
    });

    beforeEach((done) => {
        truncateTables(db).then(done).catch(err => done(err));
    });

    it('end to end', (done) => {
        const requests = inventory.map(sku => service.createSku(sku));
        Promise.all(requests)
            .then(() => service.buildSkuReport())
            .then((report) => {
                expect(Object.keys(report.body.skus).length).to.equal(32);
                expect(report.body.totalValue).to.equal(1037.33);
                expect(report.body.totalStartingValue).to.equal(1933.01);
                expect(report.body.totalConsumedValue).to.equal(895.7);
                expect(report.body.totalSpoiledValue).to.equal(0);
            })
            .then(() => done())
            .catch(err => done(err));
    });

    xdescribe('getSku', () => {
        it('returns undefined for a sku when no events have been saved', (done) => {
            service.getSku('abcd')
                .then((sku) => {
                    expect(sku).to.be.undefined;
                })
                .then(done)
                .catch(err => done(err));
        });

        it('returns undefined for a sku that doesn\'t exist', (done) => {
            const sku = {
                invoiceDateUtc: '2018-09-04T23:44:44.973Z',
                vendor: 'Villa Jerada, LLC',
                invoice: '22338',
                sku: 'AtlasOliveOil3L',
                unitCost: 22.73,
                unit: 'unit',
                startingQuantity: 4,
                consumedQuantity: 0,
                spoiledQuantity: 0,
                shrankQuantity: 0,
            };
            service.createSku(sku)
                .then(() => service.getSku('foobar'))
                .then((skuReport) => {
                    expect(skuReport).to.be.undefined;
                })
                .then(done)
                .catch(err => done(err));
        });

        it('returns a saved sku', (done) => {
            const sku = {
                invoiceDateUtc: '2018-09-04T23:44:44.973Z',
                vendor: 'Villa Jerada, LLC',
                invoice: '22338',
                sku: 'AtlasOliveOil3L',
                unitCost: 22.73,
                unit: 'unit',
                startingQuantity: 4,
                consumedQuantity: 0,
                spoiledQuantity: 0,
                shrankQuantity: 0,
            };
            service.createSku(sku)
                .then(() => service.getSku(sku.sku))
                .then((skuReport) => {
                    expect(skuReport).to.exist;
                    expect(skuReport.sku).to.equal('AtlasOliveOil3L');
                    expect(skuReport.bookValue).to.equal(90.92);
                })
                .then(done)
                .catch(err => done(err));
        });
    });
});
