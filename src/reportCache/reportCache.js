const rowToReport = require('./rowToReport');
const validateReport = require('./validateReport');

const getUpdateQuery = (report) => {
    const nowUtc = new Date().toISOString();
    const reportBodyJson = JSON.stringify(report.reportBody);
    const query = `UPDATE report_cache SET last_sequence_id = '${report.lastSequenceId}', report_body = '${reportBodyJson}', updated_utc = '${nowUtc}' WHERE cache_key = '${report.cacheKey}'`;
    return query;
};

const getInsertQuery = (report) => {
    const nowUtc = new Date().toISOString();
    const reportBodyJson = JSON.stringify(report.reportBody);
    const query = `INSERT INTO report_cache (cache_key, last_sequence_id, report_body, updated_utc) VALUES ('${report.cacheKey}', ${report.lastSequenceId}, '${reportBodyJson}', '${nowUtc}')`;
    return query;
};

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
        this.getReport(report.cacheKey).then((existingReport) => {
            const query = existingReport ?
                getUpdateQuery(report) : getInsertQuery(report);
            return new Promise((resolve, reject) => {
                this.database.run(query, (err) => {
                    if (err) reject(err);
                    resolve();
                });
            });
        });
    }
}

module.exports = ReportCache;
