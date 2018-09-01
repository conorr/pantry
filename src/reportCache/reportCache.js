const rowToReport = require('./rowToReport');
const validateReport = require('./validateReport');

const getUpdateQuery = (report) => {
    const nowUtc = new Date().toISOString();
    const reportBodyJson = JSON.stringify(report.reportBody);
    const query = `update report_cache set last_sequence_id = '${report.lastSequenceId}', report_body = '${reportBodyJson}', updated_utc = '${nowUtc}' where cache_key = '${report.cacheKey}'`;
    return query;
};

const getInsertQuery = (report) => {
    const nowUtc = new Date().toISOString();
    const reportBodyJson = JSON.stringify(report.reportBody);
    const query = `insert into report_cache (cache_key, last_sequence_id, report_body, updated_utc) values ('${report.cacheKey}', ${report.lastSequenceId}, '${reportBodyJson}', '${nowUtc}')`;
    return query;
};

class ReportCache {
    constructor(database) {
        this.database = database;
    }

    getReport(cacheKey) {
        const query = `select * from report_cache where cache_key = '${cacheKey}'`;
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
