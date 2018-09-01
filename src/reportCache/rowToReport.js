const rowToReport = row => ({
    cacheKey: row.cache_key,
    lastSequenceId: row.last_sequence_id,
    reportBody: JSON.parse(row.report_body),
    updatedUtc: new Date(row.updated_utc),
});

module.exports = rowToReport;
