class ReportBuilder {
    constructor(eventStore, reportCache) {
        this.eventStore = eventStore;
        this.reportCache = reportCache;
    }

    buildReport(cacheKey, eventAccumulator, defaultReport = {}) {
        return new Promise((resolve, reject) => {
            this.reportCache.getReport(cacheKey)
                .then((report) => {
                    const lastSequenceId = report ? report.lastSequenceId : 0;

                    this.eventStore.getEvents(lastSequenceId)
                        .then((events) => {
                            if (events.length === 0) resolve(report);

                            const updatedReport = events.reduce(
                                eventAccumulator,
                                report || defaultReport,
                            );

                            this.reportCache
                                .saveReport(cacheKey, updatedReport)
                                .then(() => resolve(updatedReport));
                        })
                        .catch(err => reject(err));
                })
                .catch(err => reject(err));
        });
    }
}

module.exports = ReportBuilder;
