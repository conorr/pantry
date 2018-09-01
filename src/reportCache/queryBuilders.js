const getInsertQuery = (report) => {
    const nowUtc = new Date().toISOString();
    const reportBodyJson = report.body ? `'${JSON.stringify(report.body)}'` : null;
    const query = `INSERT INTO report_cache (key, last_sequence_id, body, updated_utc) VALUES ('${report.key}', ${report.lastSequenceId}, ${reportBodyJson}, '${nowUtc}')`;
    return query;
};

const getUpdateQuery = (report) => {
    const nowUtc = new Date().toISOString();
    const reportBodyJson = report.body ? `'${JSON.stringify(report.body)}'` : null;
    const query = `UPDATE report_cache SET last_sequence_id = '${report.lastSequenceId}', body = ${reportBodyJson}, updated_utc = '${nowUtc}' WHERE key = '${report.key}'`;
    return query;
};

module.exports = {
    getInsertQuery,
    getUpdateQuery,
};
