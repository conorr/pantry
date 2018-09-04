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
            .then((report) => {
                const lastSequenceId = report ? report.lastSequenceId : 0;
                return this.eventStore.getEvents(lastSequenceId + 1)
                    .then(events => (
                        {
                            report: report || initializeReport(cacheKey),
                            events,
                        }
                    ));
            })
            .then(({ report, events }) => {
                if (events.length === 0) return Promise.resolve(report);

                const updatedReport = {
                    cacheKey,
                    lastSequenceId: events[events.length - 1].sequenceId,
                    body: events.reduce(reportBodyReducer, report.body),
                };

                return this.reportCache
                    .saveReport(updatedReport)
                    .then(() => updatedReport);
            });
    }
}

module.exports = ReportBuilder;
