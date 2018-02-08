const mysql = require('mysql');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const EventStore = require('../../src/eventStore/eventStore');

const should = chai.should(); // eslint-disable-line no-unused-vars
chai.use(chaiAsPromised);

/* eslint-disable no-undef */

const pool = mysql.createPool({
    connectionLimit: 5,
    host: 'localhost',
    user: 'root',
    database: 'damoori_integration_test',
    timezone: 'Z',
});

describe('Event store', () => {
    let eventStore;

    before(() => {
        eventStore = new EventStore(pool);
    });

    beforeEach((done) => {
        pool.getConnection((error, connection) => {
            if (error) throw error;
            connection.query('truncate table events;');
            done();
        });
    });

    it('it saves and retrieves one event', (done) => {
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
                const delta = (Math.floor(currentDate.getTime() / 1000) -
                    Math.floor(createdDate.getTime() / 1000));
                delta.should.be.below(2);
            })
            .then(done)
            .catch(done);
    });
});
