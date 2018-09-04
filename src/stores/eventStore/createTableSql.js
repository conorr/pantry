const createTableSql = `CREATE TABLE IF NOT EXISTS 'events' (
    'sequence_id' INTEGER,
    'type' TEXT NOT NULL,
    'version' INTEGER,
    'namespace' TEXT,
    'body' TEXT,
    'created_utc' TEXT NOT NULL,
    PRIMARY KEY('sequence_id')
);`;

module.exports = createTableSql;
