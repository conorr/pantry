const rowToEvent = row => ({
    sequenceId: row.sequence_id,
    type: row.type,
    version: row.version,
    namespace: row.namespace,
    body: JSON.parse(row.body),
    createdUtc: row.created_utc.toISOString(),
});

module.exports = rowToEvent;
