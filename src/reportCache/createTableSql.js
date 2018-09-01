const createTableSql = `CREATE TABLE IF NOT EXISTS 'report_cache' (
    'id' INTEGER,
    'cache_key' TEXT NOT NULL UNIQUE,
    'last_sequence_id' INTEGER NOT NULL,
    'report_body' TEXT,
    'updated_utc' TEXT NOT NULL,
    PRIMARY KEY('id')
);`;

module.exports = createTableSql;
