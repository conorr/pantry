const getInsertQuery = (report) => {
    const nowUtc = new Date().toISOString();
    const reportBodyJson = report.body ? `'${JSON.stringify(report.body)}'` : null;
    const query = `INSERT INTO report_cache (cache_key, last_sequence_id, body, updated_utc) VALUES ('${report.cacheKey}', ${report.lastSequenceId}, ${reportBodyJson}, '${nowUtc}')`;
    return query;
};

const getUpdateQuery = (report) => {
    const nowUtc = new Date().toISOString();
    const reportBodyJson = report.body ? `'${JSON.stringify(report.body)}'` : null;
    const query = `UPDATE report_cache SET last_sequence_id = '${report.lastSequenceId}', body = ${reportBodyJson}, updated_utc = '${nowUtc}' WHERE cache_key = '${report.cacheKey}'`;
    return query;
};

module.exports = {
    getInsertQuery,
    getUpdateQuery,
};
