const mysql = require('mysql');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const EventStore = require('../../src/eventStore/eventStore');

const should = chai.should(); // eslint-disable-line no-unused-vars
chai.use(chaiAsPromised);

/* eslint-disable no-undef, object-curly-newline */

const mysqlHost = 'localhost';
const mysqlUser = 'root';
const mysqlDatabase = 'damoori_integration_test';

const truncateEventsTable = () => new Promise((resolve, reject) => {
    const connection = mysql.createConnection({
        host: mysqlHost,
        user: mysqlUser,
        database: mysqlDatabase,
    });
    connection.connect();
    connection.query('truncate table events', (error) => {
        if (error) reject(error);
        resolve();
    });
});

describe('Event store', () => {
    let eventStore;

    before(() => {
        eventStore = new EventStore(mysqlHost, mysqlUser, mysqlDatabase);
    });

    describe('construction', () => {
        it('throws an error if mysqlHost is null or undefined');
        it('throws an error if mysqlUser is null or undefined');
        it('throws an error if mysqlDatabase is null or undefined');
    });

    describe('end to end', () => {
        beforeEach((done) => {
            truncateEventsTable().then(done);
        });

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
                .then(done)
                .catch(done);
        });
    });

    describe('saveEvents', () => {
        before((done) => {
            eventStore.saveEvent({
                type: 'AUGMENT_ORANGE',
                version: 1,
                namespace: '',
                body: {},
            }).then(done);
        });

        it('throws an error if not passed an array', () => {
            const badCall = () => eventStore.saveEvents('oops');
            badCall.should.throw();
        });

        it('returns a resolved promise if passed an empty array', (done) => {
            eventStore.saveEvents([]).then(done);
        });
    });
});
