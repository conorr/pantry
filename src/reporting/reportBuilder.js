class ReportBuilder {
    constructor(eventStore, reportCache) {
        this.eventStore = eventStore;
        this.reportCache = reportCache;
    }

    buildReport(cacheKey, reportBodyReducer) {
        return this.reportCache.getReport(cacheKey)
            .then((cachedReport) => {
                const report = cachedReport ||
                    ReportBuilder.initializeReport(cacheKey);
                return this.eventStore.getEvents({ sequenceIdStart: report.lastSequenceId + 1 })
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
