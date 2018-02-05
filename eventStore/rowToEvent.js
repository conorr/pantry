const rowToEvent = (row) => {
    return {
        sequenceId: row['sequence_id'],
        type: row['type'],
        version: row['version'],
        body: JSON.parse(row['body']),
        createdUtc: row['created_utc'].toISOString()
    };
};

module.exports = rowToEvent;