const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const { buildSaveEventQuery } = require('../../../src/stores/eventStore/queryBuilders');

chai.use(chaiAsPromised);
chai.should();

/* eslint-disable no-undef, object-curly-newline */

describe('eventStore query builders', () => {
    describe('buildSaveEventQuery', () => {
        let event;

        beforeEach(() => {
            event = {
                type: 'X_CHANGED',
                version: 1,
                namespace: 'events',
                body: { foo: 'bar' },
                createdUtc: '2018-09-04T19:53:43.026Z',
            };
        });

        it('handles non-null event type', () => {
            queryResult = buildSaveEventQuery(event);
            queryExpect = 'INSERT INTO events (type, entity_type, entity_id, version, namespace, body, created_utc) VALUES (\'X_CHANGED\',null,null,1,\'events\',\'{"foo":"bar"}\',\'2018-09-04T19:53:43.026Z\')';
            queryResult.should.equal(queryExpect);
        });

        it('handles null type', () => {
            event.type = null;
            queryResult = buildSaveEventQuery(event);
            queryExpect = 'INSERT INTO events (type, entity_type, entity_id, version, namespace, body, created_utc) VALUES (null,null,null,1,\'events\',\'{"foo":"bar"}\',\'2018-09-04T19:53:43.026Z\')';
            queryResult.should.equal(queryExpect);
        });

        it('handles valid version', () => {
            queryResult = buildSaveEventQuery(event);
            queryExpect = 'INSERT INTO events (type, entity_type, entity_id, version, namespace, body, created_utc) VALUES (\'X_CHANGED\',null,null,1,\'events\',\'{"foo":"bar"}\',\'2018-09-04T19:53:43.026Z\')';
            queryResult.should.equal(queryExpect);
        });

        it('handles null version', () => {
            event.version = null;
            queryResult = buildSaveEventQuery(event);
            queryExpect = 'INSERT INTO events (type, entity_type, entity_id, version, namespace, body, created_utc) VALUES (\'X_CHANGED\',null,null,0,\'events\',\'{"foo":"bar"}\',\'2018-09-04T19:53:43.026Z\')';
            queryResult.should.equal(queryExpect);
        });

        it('handles valid namespace', () => {
            queryResult = buildSaveEventQuery(event);
            queryExpect = 'INSERT INTO events (type, entity_type, entity_id, version, namespace, body, created_utc) VALUES (\'X_CHANGED\',null,null,1,\'events\',\'{"foo":"bar"}\',\'2018-09-04T19:53:43.026Z\')';
            queryResult.should.equal(queryExpect);
        });

        it('handles empty string namespace', () => {
            event.namespace = '';
            queryResult = buildSaveEventQuery(event);
            queryExpect = 'INSERT INTO events (type, entity_type, entity_id, version, namespace, body, created_utc) VALUES (\'X_CHANGED\',null,null,1,\'\',\'{"foo":"bar"}\',\'2018-09-04T19:53:43.026Z\')';
            queryResult.should.equal(queryExpect);
        });

        it('handles null namespace', () => {
            event.namespace = null;
            queryResult = buildSaveEventQuery(event);
            queryExpect = 'INSERT INTO events (type, entity_type, entity_id, version, namespace, body, created_utc) VALUES (\'X_CHANGED\',null,null,1,null,\'{"foo":"bar"}\',\'2018-09-04T19:53:43.026Z\')';
            queryResult.should.equal(queryExpect);
        });

        it('handles valid body', () => {
            queryResult = buildSaveEventQuery(event);
            queryExpect = 'INSERT INTO events (type, entity_type, entity_id, version, namespace, body, created_utc) VALUES (\'X_CHANGED\',null,null,1,\'events\',\'{"foo":"bar"}\',\'2018-09-04T19:53:43.026Z\')';
            queryResult.should.equal(queryExpect);
        });

        it('handles null body', () => {
            event.body = null;
            queryResult = buildSaveEventQuery(event);
            queryExpect = 'INSERT INTO events (type, entity_type, entity_id, version, namespace, body, created_utc) VALUES (\'X_CHANGED\',null,null,1,\'events\',null,\'2018-09-04T19:53:43.026Z\')';
            queryResult.should.equal(queryExpect);
        });
    });
});
