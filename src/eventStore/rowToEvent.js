const rowToEvent = row => ({
    sequenceId: row.sequence_id,
    type: row.type,
    version: row.version,
    namespace: row.namespace,
    body: JSON.parse(row.body),
    createdUtc: new Date(row.created_utc),
});

module.exports = rowToEvent;
