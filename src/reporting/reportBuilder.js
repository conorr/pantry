const initializeReport = cacheKey => (
    {
        cacheKey,
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
                if (events.length === 0) return report;

                const updatedReport = Object.assign({}, report);

                updatedReport.body = events.reduce(
                    reportBodyReducer,
                    updatedReport ? updatedReport.body : {},
                );

                updatedReport.lastSequenceId = events[events.length - 1].sequenceId;

                return this.reportCache
                    .saveReport(updatedReport)
                    .then(() => updatedReport);
            });
    }
}

module.exports = ReportBuilder;
