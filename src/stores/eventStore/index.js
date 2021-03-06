const validateEvent = require('./validateEvent');
const validateGetEventsRequest = require('./validateGetEventsRequest');
const rowToEvent = require('./rowToEvent');
const {
    buildSelectEventQuery,
    buildSelectEventsQuery,
    buildSaveEventQuery,
    buildSaveEventsQuery,
} = require('./queryBuilders');

class EventStore {
    constructor(database) {
        this.database = database;
    }

    getEvent(sequenceId) {
        const query = buildSelectEventQuery(sequenceId);
        return new Promise((resolve, reject) => {
            this.database.get(query, (err, row) => {
                if (err) reject(err);
                const event = rowToEvent(row);
                resolve(event);
            });
        });
    }

    getEvents(request = {}) {
        const validatedRequest = validateGetEventsRequest(request);
        const query = buildSelectEventsQuery(validatedRequest);
        return new Promise((resolve, reject) => {
            this.database.all(query, (err, rows) => {
                if (err) reject(err);
                const events = rows ? rows.map(rowToEvent) : [];
                resolve(events);
            });
        });
    }

    saveEvent(event) {
        validateEvent(event);
        const query = buildSaveEventQuery(event);
        return new Promise((resolve, reject) => {
            this.database.run(query, (err) => {
                if (err) reject(err);
                resolve();
            });
        });
    }

    saveEvents(events) {
        if (!Array.isArray(events)) throw new Error('events must be an array of events');
        if (events.length === 0) return Promise.resolve();
        if (events.length === 1) return this.saveEvent(events[0]);
        const query = buildSaveEventsQuery(events);
        return new Promise((resolve, reject) => {
            this.database.run(query, (err) => {
                if (err) reject(err);
                resolve();
            });
        });
    }
}

module.exports = EventStore;
