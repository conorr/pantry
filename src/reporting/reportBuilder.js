const initializeReport = cacheKey => (
    {
        cacheKey,
        // reminder: first event will have a sequenceId of 1, due to sqlite's
        // autoincrement handling. https://sqlite.org/autoinc.html
        lastSequenceId: 0,
        body: {},
    }
);

class ReportBuilder {
    constructor(eventStore, reportCache) {
        this.eventStore = eventStore;
        this.reportCache = reportCache;
    }

    buildReport(cacheKey, reportBodyReducer) {
        return this.reportCache.getReport(cacheKey)
            .then((cachedReport) => {
                const report = cachedReport || initializeReport(cacheKey);
                return this.eventStore.getEvents(report.lastSequenceId + 1)
                    .then(events => (
                        {
                            report: report || initializeReport(cacheKey),
                            events,
                        }
                    ));
            })
            .then(({ report, events }) => {
                if (events.length === 0) return Promise.resolve(report);
                const lastSequenceId = events[events.length - 1].sequenceId;
                const body = events.reduce(reportBodyReducer, report.body);
                const newReport = { cacheKey, lastSequenceId, body };
                return this.reportCache
                    .saveReport(newReport)
                    .then(() => newReport);
            });
    }
}

module.exports = ReportBuilder;
