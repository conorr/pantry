const rowToReport = row => ({
    key: row.key,
    lastSequenceId: row.last_sequence_id,
    reportBody: JSON.parse(row.report_body),
    updatedUtc: new Date(row.updated_utc),
});

module.exports = rowToReport;
