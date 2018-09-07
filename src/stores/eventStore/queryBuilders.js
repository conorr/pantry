const isString = val => typeof val === 'string';

const isDefinedObject = obj => obj && typeof obj === 'object';

const quoteString = str => `'${str}'`;

const prepareStringValue = str => (isString(str) ? quoteString(str) : 'null');

const prepareObjectValue = obj => (isDefinedObject(obj) ? quoteString(JSON.stringify(obj)) : 'null');


const buildSelectEventQuery = (sequenceId) => {
    const query = `SELECT * FROM events WHERE sequence_id = ${sequenceId}`;
    return query;
};

const buildSelectEventsQuery = (request) => {
    const conditions = [`sequence_id >= ${request.sequenceIdStart}`];
    if (request.entityType) conditions.push(`entity_type = '${request.entityType}'`);
    if (request.entityId) conditions.push(`entity_id = '${request.entityId}'`);
    if (request.type) conditions.push(`type = '${request.type}'`);
    if (request.namespace) conditions.push(`namespace = '${request.namespace}'`);
    const conditionClause = conditions.join(' AND ');
    const query = `SELECT * FROM events WHERE ${conditionClause} ORDER BY sequence_id ASC LIMIT ${request.top}`;
    return query;
};


const buildInsertRow = (event) => {
    const values = [
        prepareStringValue(event.type),
        prepareStringValue(event.entityType),
        prepareStringValue(event.entityId),
        event.version || 0,
        prepareStringValue(event.namespace),
        prepareObjectValue(event.body),
        event.createdUtc ? quoteString(event.createdUtc) : quoteString(new Date().toISOString()),
    ];
    return `(${values.join(',')})`;
};

const buildSaveEventQuery = (event) => {
    const row = buildInsertRow(event);
    const query = `INSERT INTO events (type, entity_type, entity_id, version, namespace, body, created_utc) VALUES ${row}`;
    return query;
};

const buildSaveEventsQuery = (events) => {
    const rows = events.map(event => buildInsertRow(event));
    const query = `INSERT INTO events (type, entity_type, entity_id, version, namespace, body, created_utc) VALUES ${rows.join(',')}`;
    return query;
};

module.exports = {
    buildSelectEventQuery,
    buildSelectEventsQuery,
    buildSaveEventQuery,
    buildSaveEventsQuery,
};
