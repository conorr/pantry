const getInsertQuery = (report) => {
    const nowUtc = new Date().toISOString();
    const reportBodyJson = report.reportBody ? `'${JSON.stringify(report.reportBody)}'` : null;
    const query = `INSERT INTO report_cache (key, last_sequence_id, report_body, updated_utc) VALUES ('${report.key}', ${report.lastSequenceId}, ${reportBodyJson}, '${nowUtc}')`;
    return query;
};

const getUpdateQuery = (report) => {
    const nowUtc = new Date().toISOString();
    const reportBodyJson = report.reportBody ? `'${JSON.stringify(report.reportBody)}'` : null;
    const query = `UPDATE report_cache SET last_sequence_id = '${report.lastSequenceId}', report_body = ${reportBodyJson}, updated_utc = '${nowUtc}' WHERE key = '${report.key}'`;
    return query;
};

module.exports = {
    getInsertQuery,
    getUpdateQuery,
};
