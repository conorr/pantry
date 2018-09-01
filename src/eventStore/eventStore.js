const validateEvent = require('./validateEvent');
const rowToEvent = require('./rowToEvent');

class EventStore {
    constructor(database) {
        this.database = database;
    }

    getEvent(sequenceId) {
        const query = `select * from events where sequence_id = ${sequenceId}`;
        return new Promise((resolve, reject) => {
            this.database.get(query, (err, row) => {
                if (err) reject(err);
                const event = rowToEvent(row);
                resolve(event);
            });
        });
    }

    getEvents(sequenceIdStart = 0, top = 100) {
        if (sequenceIdStart < 0) throw new Error('sequenceIdStart must be zero or greater');
        if (top < 0) throw new Error('top must be zero or greater');
        const query = `select * from events where sequence_id >= ${sequenceIdStart} order by sequence_id asc limit ${top}`;
        return new Promise((resolve, reject) => {
            this.database.all(query, (err, rows) => {
                if (err) reject(err);
                const events = rows.map(rowToEvent);
                resolve(events);
            });
        });
    }

    saveEvent(event) {
        validateEvent(event);
        const bodySerialized = JSON.stringify(event.body);
        const utcDatetime = new Date().toISOString();
        const query = `insert into events(type, version, namespace, body, created_utc) values ('${event.type}', ${event.version}, '${event.namespace}', '${bodySerialized}', '${utcDatetime}')`;
        this.database.run(query);
        return Promise.resolve();
    }

    saveEvents(events) {
        if (!Array.isArray(events)) throw new Error('events must be an array of events');
        if (events.length === 0) return Promise.resolve();
        if (events.length === 1) return this.saveEvent(events[0]);
        const utcDatetime = new Date().toISOString();
        const values = events.map((event) => {
            const bodySerialized = JSON.stringify(event.body);
            return `('${event.type}', ${event.version}, '${event.namespace}', '${bodySerialized}', '${utcDatetime}')`;
        });
        const query = `insert into events(type, version, namespace, body, created_utc) values ${values.join(',')};`;
        return new Promise((resolve, reject) => {
            this.database.run(query, (err) => {
                if (err) reject(err);
                resolve();
            });
        });
    }
}

module.exports = EventStore;
