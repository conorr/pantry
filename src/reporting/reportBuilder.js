class ReportBuilder {
    constructor(eventStore, reportCache) {
        this.eventStore = eventStore;
        this.reportCache = reportCache;
    }

    buildReport(cacheKey, reportBodyReducer) {
        return new Promise((resolve, reject) => {
            this.reportCache.getReport(cacheKey)
                .then((report) => {
                    const lastSequenceId = report ? report.lastSequenceId : 0;

                    this.eventStore.getEvents(lastSequenceId + 1)
                        .then((events) => {
                            if (events.length === 0) resolve(report);

                            const updatedReport = Object.assign(
                                {},
                                report || { cacheKey, lastSequenceId },
                            );

                            updatedReport.body = events.reduce(
                                reportBodyReducer,
                                updatedReport ? updatedReport.body : {},
                            );

                            updatedReport.lastSequenceId = events[events.length - 1].sequenceId;

                            this.reportCache
                                .saveReport(updatedReport)
                                .then(() => resolve(updatedReport));
                        })
                        .catch(err => reject(err));
                })
                .catch(err => reject(err));
        });
    }
}

module.exports = ReportBuilder;
