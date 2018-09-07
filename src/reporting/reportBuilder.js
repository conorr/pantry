const Joi = require('joi');
const eventsFilterSchema = require('./eventsFilterSchema');

class ReportBuilder {
    constructor(eventStore, reportCache) {
        this.eventStore = eventStore;
        this.reportCache = reportCache;
    }

    buildReport(cacheKey, eventsFilter, reportBodyReducer) {
        ReportBuilder.validateEventsFilter(eventsFilter);
        return this.reportCache.getReport(cacheKey)
            .then((cachedReport) => {
                const report = cachedReport ||
                    ReportBuilder.initializeReport(cacheKey);
                const getEventsRequest = Object.assign({}, eventsFilter, {
                    sequenceIdStart: report.lastSequenceId + 1,
                });
                return this.eventStore.getEvents(getEventsRequest)
                    .then(events => ({ report, events }));
            })
            .then(({ report, events }) => {
                if (events.length === 0) return Promise.resolve(report);
                const newReport = {
                    cacheKey: report.cacheKey,
                    lastSequenceId: events[events.length - 1].sequenceId,
                    body: events.reduce(reportBodyReducer, report.body),
                };
                return this.reportCache.saveReport(newReport)
                    .then(() => newReport);
            });
    }

    static validateEventsFilter(eventsFilter) {
        const result = Joi.validate(eventsFilter, eventsFilterSchema);
        if (result.error) throw new Error(`eventsFilter failed validation: ${result.error}`);
    }

    static initializeReport(cacheKey) {
        return {
            cacheKey,
            // Note: first event will have a sequenceId of 1, due to sqlite's
            // autoincrement handling. https://sqlite.org/autoinc.html
            lastSequenceId: 0,
            body: {},
        };
    }
}

module.exports = ReportBuilder;
