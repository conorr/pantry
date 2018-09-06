const rowToEvent = row => ({
    sequenceId: row.sequence_id,
    type: row.type,
    version: row.version,
    entityType: row.entity_type,
    entityId: row.entity_id,
    namespace: row.namespace,
    body: JSON.parse(row.body),
    createdUtc: new Date(row.created_utc),
});

module.exports = rowToEvent;
