const mysql = require('mysql');
const validateEvent = require('./validateEvent');
const rowToEvent = require('./rowToEvent');

const pool = mysql.createPool({
    connectionLimit: 5,
    host: 'localhost',
    user: 'root',
    database: 'damoori',
});

const getEvent = (sequenceId) => {
    const query = `select * from events where sequence_id = ${sequenceId}`;
    return new Promise((resolve, reject) => {
        pool.getConnection((error, connection) => {
            if (error) reject(error);
            connection.query(query, (err, result) => {
                connection.release();
                if (err) reject(err);
                let event;
                if (result.length === 1) {
                    event = rowToEvent(result[0]);
                }
                resolve(event);
            });
        });
    });
};

const getEvents = (sequenceIdStart = 0, top = 100) => {
    if (sequenceIdStart < 0) throw new Error('sequenceIdStart must be zero or greater');
    if (top < 0) throw new Error('top must be zero or greater');
    const query = `select * from events where sequence_id >= ${sequenceIdStart} limit ${top}`;
    return new Promise((resolve, reject) => {
        pool.getConnection((error, connection) => {
            if (error) reject(error);
            connection.query(query, (err, results) => {
                connection.release();
                if (err) reject(err);
                let events = [];
                if (results.length > 0) {
                    events = results.map(rowToEvent);
                }
                resolve(events);
            });
        });
    });
};

const saveEvent = (event) => {
    validateEvent(event);
    const bodySerialized = JSON.stringify(event.body);
    const query = `insert into events(type, version, namespace, body, created_utc) values ('${event.type}', ${event.version}, '${event.namespace}', '${bodySerialized}', UTC_TIMESTAMP())`;
    pool.getConnection((error, connection) => {
        if (error) throw error;
        connection.query(query, (err) => {
            connection.release();
            if (err) throw err;
        });
    });
};

module.exports = {
    getEvent,
    getEvents,
    saveEvent,
};
