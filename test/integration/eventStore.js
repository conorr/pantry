const { Database } = require('sqlite3');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const EventStore = require('../../src/eventStore/eventStore');
const createTableSql = require('../../src/eventStore/createTableSql');

chai.use(chaiAsPromised);
chai.should();

/* eslint-disable no-undef, object-curly-newline */

createEventsTable = db => new Promise((resolve, reject) => {
    db.run(createTableSql, (err) => {
        if (err) reject(err);
        resolve();
    });
});

truncateEventsTable = db => new Promise((resolve, reject) => {
    db.run('DELETE FROM \'events\';', (err) => {
        if (err) reject(err);
        resolve();
    });
});

describe('Event store', () => {
    let eventStore;
    let db;

    before((done) => {
        db = new Database(':memory:');
        eventStore = new EventStore(db);
        createEventsTable(db).then(done);
    });

    beforeEach((done) => {
        truncateEventsTable(db).then(done);
    });

    describe('end to end', () => {
        it('saves and retrieves one event', (done) => {
            eventStore.saveEvent({
                type: 'HELLO_WORLD',
                version: 1,
                namespace: '',
                body: { foo: 'bar' },
            })
                .then(() => eventStore.getEvents())
                .then((events) => {
                    events.should.have.lengthOf(1);

                    const event = events[0];
                    event.sequenceId.should.equal(1);
                    event.type.should.equal('HELLO_WORLD');
                    event.version.should.equal(1);
                    event.namespace.should.equal('');
                    event.body.should.deep.equal({ foo: 'bar' });

                    const currentDate = new Date();
                    const createdDate = new Date(event.createdUtc);
                    const deltaSeconds = (Math.floor(currentDate.getTime() / 1000) -
                        Math.floor(createdDate.getTime() / 1000));
                    deltaSeconds.should.be.below(2);
                })
                .then(done)
                .catch(done);
        });

        it('saves and retrieves multiple events', (done) => {
            eventStore.saveEvents([
                { type: 'ADD_BANANA', version: 1, namespace: '', body: {} },
                { type: 'REMOVE_BANANA', version: 1, namespace: '', body: {} },
                { type: 'ADD_ORANGE', version: 1, namespace: '', body: {} },
                { type: 'AUGMENT_ORANGE', version: 1, namespace: '', body: {} },
                { type: 'REMOVE_ORANGE', version: 1, namespace: '', body: {} },
            ])
                .then(() => eventStore.getEvents())
                .then((events) => {
                    events.should.have.lengthOf(5);

                    let event = events.shift();
                    event.sequenceId.should.equal(1);
                    event.type.should.equal('ADD_BANANA');

                    event = events.shift();
                    event.sequenceId.should.equal(2);
                    event.type.should.equal('REMOVE_BANANA');

                    event = events.shift();
                    event.sequenceId.should.equal(3);
                    event.type.should.equal('ADD_ORANGE');

                    event = events.shift();
                    event.sequenceId.should.equal(4);
                    event.type.should.equal('AUGMENT_ORANGE');

                    event = events.shift();
                    event.sequenceId.should.equal(5);
                    event.type.should.equal('REMOVE_ORANGE');
                })
                .then(() => done())
                .catch(err => done(err));
        });
    });

    describe('getEvent', () => {
        it('gets correct event by sequenceId', (done) => {
            eventStore.saveEvents([
                { type: 'ADD_BANANA', version: 1, namespace: '', body: {} },
                { type: 'REMOVE_BANANA', version: 1, namespace: '', body: {} },
                { type: 'ADD_ORANGE', version: 1, namespace: '', body: {} },
                { type: 'AUGMENT_ORANGE', version: 1, namespace: '', body: {} },
                { type: 'REMOVE_ORANGE', version: 1, namespace: '', body: {} },
            ])
                .then(() => eventStore.getEvent(3))
                .then((event) => {
                    event.type.should.equal('ADD_ORANGE');
                })
                .then(() => done())
                .catch(err => done(err));
        });
    });

    describe('getEvents', () => {
        it('gets a slice of events correctly', (done) => {
            eventStore.saveEvents([
                { type: 'ADD_BANANA', version: 1, namespace: '', body: { foo: 'bar' } },
                { type: 'REMOVE_BANANA', version: 1, namespace: '', body: {} },
                { type: 'ADD_ORANGE', version: 1, namespace: '', body: {} },
                { type: 'AUGMENT_ORANGE', version: 1, namespace: '', body: {} },
                { type: 'REMOVE_ORANGE', version: 1, namespace: '', body: {} },
            ])
                .then(() => eventStore.getEvents(3, 3))
                .then((events) => {
                    events.should.have.lengthOf(3);

                    let event = events.shift();
                    event.sequenceId.should.equal(3);
                    event.type.should.equal('ADD_ORANGE');

                    event = events.shift();
                    event.sequenceId.should.equal(4);
                    event.type.should.equal('AUGMENT_ORANGE');

                    event = events.shift();
                    event.sequenceId.should.equal(5);
                    event.type.should.equal('REMOVE_ORANGE');
                })
                .then(() => done())
                .catch(err => done(err));
        });
    });

    describe('saveEvents', () => {
        before((done) => {
            eventStore.saveEvent({
                type: 'AUGMENT_ORANGE',
                version: 1,
                namespace: '',
                body: {},
            })
                .then(() => done())
                .catch(err => done(err));
        });

        it('throws an error if not passed an array', (done) => {
            const badCall = () => eventStore.saveEvents('oops');
            badCall.should.throw();
            done();
        });

        it('returns a resolved promise if passed an empty array', (done) => {
            eventStore.saveEvents([])
                .then(() => done())
                .catch(err => done(err));
        });
    });
});
