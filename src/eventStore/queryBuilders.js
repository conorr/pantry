const buildSelectEventQuery = (sequenceId) => {
    const query = `SELECT * FROM events WHERE sequence_id = ${sequenceId}`;
    return query;
};

const buildSelectEventsQuery = (sequenceIdStart, top) => {
    const query = `SELECT * FROM events WHERE sequence_id >= ${sequenceIdStart} ORDER BY sequence_id ASC LIMIT ${top}`;
    return query;
};


const isString = val => typeof val === 'string';

const isDefinedObject = obj => obj && typeof obj === 'object';

const quoteString = str => `'${str}'`;

const prepareStringValue = str => (isString(str) ? quoteString(str) : 'null');

const prepareObjectValue = obj => (isDefinedObject(obj) ? quoteString(JSON.stringify(obj)) : 'null');


const buildInsertRow = (event) => {
    const values = [
        prepareStringValue(event.type),
        event.version || 0,
        prepareStringValue(event.namespace),
        prepareObjectValue(event.body),
        event.createdUtc ? quoteString(event.createdUtc) : quoteString(new Date().toISOString()),
    ];
    return `(${values.join(',')})`;
};

const buildSaveEventQuery = (event) => {
    const row = buildInsertRow(event);
    const query = `INSERT INTO events (type, version, namespace, body, created_utc) VALUES ${row}`;
    return query;
};

const buildSaveEventsQuery = (events) => {
    const rows = events.map(event => buildInsertRow(event));
    const query = `INSERT INTO events (type, version, namespace, body, created_utc) VALUES ${rows.join(',')}`;
    return query;
};

module.exports = {
    buildSelectEventQuery,
    buildSelectEventsQuery,
    buildSaveEventQuery,
    buildSaveEventsQuery,
};
