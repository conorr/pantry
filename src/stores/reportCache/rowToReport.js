const rowToReport = row => ({
    cacheKey: row.cache_key,
    lastSequenceId: row.last_sequence_id,
    body: JSON.parse(row.body),
    updatedUtc: new Date(row.updated_utc),
});

module.exports = rowToReport;
