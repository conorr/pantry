const rowToReport = require('./rowToReport');
const validateReport = require('./validateReport');
const { getUpdateQuery, getInsertQuery } = require('./queryBuilders');

class ReportCache {
    constructor(database) {
        this.database = database;
    }

    getReport(cacheKey) {
        const query = `SELECT cache_key, last_sequence_id, report_body, updated_utc FROM report_cache WHERE cache_key = '${cacheKey}'`;
        return new Promise((resolve, reject) => {
            this.database.get(query, (err, row) => {
                if (err) reject(err);
                const report = row ? rowToReport(row) : undefined;
                resolve(report);
            });
        });
    }

    saveReport(report) {
        validateReport(report);
        return new Promise((resolve, reject) => {
            this.getReport(report.cacheKey).then((existingReport) => {
                const query = existingReport ?
                    getUpdateQuery(report) : getInsertQuery(report);
                this.database.run(query, (err) => {
                    if (err) reject(err);
                    resolve();
                });
            });
        });
    }
}

module.exports = ReportCache;
