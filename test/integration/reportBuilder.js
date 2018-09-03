const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const { Database } = require('sqlite3');
const EventStore = require('../../src/eventStore/eventStore');
const ReportBuilder = require('../../src/reporting/reportBuilder');
const ReportCache = require('../../src/reportCache/reportCache');

/* eslint-disable no-undef, no-unused-expressions */

chai.use(chaiAsPromised);
chai.should();

const truncateTables = db => new Promise((resolve, reject) => {
    db.run('DELETE FROM \'events\';', (err1) => {
        if (err1) reject(err1);
        db.run('DELETE FROM \'report_cache\';', (err2) => {
            if (err2) reject(err2);
            resolve();
        });
    });
});

describe('reportBuilder', () => {
    let db;
    let eventStore;
    let reportCache;
    let reportBuilder;

    before(() => {
        db = new Database('pantry.db');
        eventStore = new EventStore(db);
        reportCache = new ReportCache(db);
        reportBuilder = new ReportBuilder(eventStore, reportCache);
    });

    beforeEach((done) => {
        truncateTables(db).then(done);
    });

    it('end to end', (done) => {
        reducer = (report, event) => {
            const updatedReport = Object.assign({}, report);
            updatedReport.body.count += event.body.amount;
            return updatedReport;
        };
        initialReport = {
            cacheKey: 'fruitReport',
            lastSequenceId: 0,
            body: { count: 0 },
        };
        reportBuilder.buildReport('fruitReport', reducer, initialReport)
            .then((report) => {
                chai.expect(report).to.be.undefined;
            })
            .then(() => eventStore.saveEvents([
                { type: 'FRUIT_ADDED', body: { amount: 2 } },
                { type: 'FRUIT_ADDED', body: { amount: 1 } },
                { type: 'FRUIT_ADDED', body: { amount: 7 } },
            ]))
            .then(() => reportBuilder.buildReport('fruitReport', reducer, initialReport))
            .then((report) => {
                report.body.count.should.equal(10);
            })
            .then(() => {
                eventStore.saveEvents([
                    { type: 'FRUIT_ADDED', body: { amount: 2 } },
                    { type: 'FRUIT_ADDED', body: { amount: 3 } },
                    { type: 'FRUIT_ADDED', body: { amount: -1 } },
                ]);
            })
            .then(() => reportBuilder.buildReport('fruitReport', reducer, initialReport))
            .then((report) => {
                report.body.count.should.equal(14);
            })
            .then(() => reportBuilder.buildReport('fruitReport', reducer, initialReport))
            .then((report) => {
                report.body.count.should.equal(14);
            })
            .then(done)
            .catch(err => done(err));
    });
});
