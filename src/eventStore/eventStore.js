const mysql = require('mysql');
const validateEvent = require('./validateEvent');
const rowToEvent = require('./rowToEvent');

class EventStore {
    constructor(mysqlHost, mysqlUser, mysqlDatabase) {
        if (!mysqlHost) throw new Error('host is required and not specified');
        if (!mysqlUser) throw new Error('user is required and not specified');
        if (!mysqlDatabase) throw new Error('database is required and not specified');
        this.pool = mysql.createPool({
            connectionLimit: 10,
            host: mysqlHost,
            user: mysqlUser,
            database: mysqlDatabase,
            timezone: 'Z',
        });
    }

    getEvent(sequenceId) {
        const query = `select * from events where sequence_id = ${sequenceId}`;
        return new Promise((resolve, reject) => {
            this.pool.getConnection((error, connection) => {
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
    }

    getEvents(sequenceIdStart = 0, top = 100) {
        if (sequenceIdStart < 0) throw new Error('sequenceIdStart must be zero or greater');
        if (top < 0) throw new Error('top must be zero or greater');
        const query = `select * from events where sequence_id >= ${sequenceIdStart} order by sequence_id asc limit ${top}`;
        return new Promise((resolve, reject) => {
            this.pool.getConnection((error, connection) => {
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
    }

    saveEvent(event) {
        validateEvent(event);
        const bodySerialized = JSON.stringify(event.body);
        const query = `insert into events(type, version, namespace, body, created_utc) values ('${event.type}', ${event.version}, '${event.namespace}', '${bodySerialized}', UTC_TIMESTAMP())`;
        return new Promise((resolve, reject) => {
            this.pool.getConnection((error, connection) => {
                if (error) throw error;
                connection.query(query, (err) => {
                    connection.release();
                    if (err) reject(err);
                    resolve();
                });
            });
        });
    }

    saveEvents(events) {
        if (!Array.isArray(events)) throw new Error('events must be an array of events');
        if (events.length === 0) return Promise.resolve();
        if (events.length === 1) return this.saveEvent(events[0]);
        const values = events.map((event) => {
            const bodySerialized = JSON.stringify(event.body);
            return `('${event.type}', ${event.version}, '${event.namespace}', '${bodySerialized}', UTC_TIMESTAMP())`;
        });
        const query = `insert into events(type, version, namespace, body, created_utc) values ${values.join(',')};`;
        return new Promise((resolve, reject) => {
            this.pool.getConnection((error, connection) => {
                if (error) reject(error);
                connection.query(query, (err) => {
                    connection.release();
                    if (err) reject(err);
                    resolve();
                });
            });
        });
    }
}

module.exports = EventStore;
