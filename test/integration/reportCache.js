const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const { Database } = require('sqlite3');
const ReportCache = require('../../src/reportCache/reportCache');
const createTableSql = require('../../src/reportCache/createTableSql');

/* eslint-disable no-undef, object-curly-newline */

chai.use(chaiAsPromised);
chai.should();

const createTable = db => new Promise((resolve, reject) => {
    db.run(createTableSql, (err) => {
        if (err) reject(err);
        resolve();
    });
});

const truncateTable = db => new Promise((resolve, reject) => {
    db.run('DELETE FROM report_cache;', (err) => {
        if (err) reject(err);
        resolve();
    });
});


describe('ReportCache', () => {
    let db;
    let reportCache;

    before(() => {
        db = new Database('pantry.db');
        createTable(db);
        reportCache = new ReportCache(db);
    });

    xdescribe('getReport', () => {
        beforeEach((done) => {
            truncateTable(db).then(done);
        });

        it('gets a report', () => {
            reportCache.saveReport({
            });
        });

        it('returns undefined if the report is not found');
        it('throws if passed an undefined cache key');
    });

    describe('saveReport', () => {
        beforeEach((done) => {
            truncateTable(db).then(done);
        });

        it('saves a report', (done) => {
            reportCache.saveReport({
                key: 'foobar123',
                lastSequenceId: 9,
            })
                .then(() => reportCache.getReport('foobar123'))
                .then((report) => {
                    report.key.should.equal('foobar123');
                })
                .then(done)
                .catch(err => done(err));
        });

        it('updates a report if the report already exists', (done) => {
            reportCache.saveReport({ key: 'foobar123', lastSequenceId: 9 })
                .then(() => reportCache.saveReport({ key: 'foobar123', lastSequenceId: 11 }))
                .then(() => reportCache.getReport('foobar123'))
                .then((report) => {
                    report.key.should.equal('foobar123');
                    report.lastSequenceId.should.equal(11);
                })
                .then(done)
                .catch(err => done(err));
        });

        it('throws if passed an invalid report', () => {
            const badCall = () => reportCache.saveReport({
                key: 'foobar123', // missing lastSequenceId
            });
            badCall.should.throw();
        });
    });

    describe('deleteReport', () => {
        it('deletes a report', (done) => {
            report = {
                key: 'foobar123',
                lastSequenceId: 1,
            };
            reportCache
                .saveReport(report)
                .then(() => reportCache.getReport('foobar123'))
                .then((report) => {
                    report.key.should.equal('foobar123');
                })
                .then(() => reportCache.deleteReport('foobar123'))
                .then(() => reportCache.getReport(report.key))
                .then((report) => {
                    // eslint-disable-next-line no-unused-expressions
                    chai.expect(report).to.be.undefined;
                })
                .then(done)
                .catch(err => done(err));
        });
    });

    describe('round trip', () => {
        it('sets and gets body correctly when null', (done) => {
            report = {
                key: 'foobar123',
                lastSequenceId: 1,
            };
            reportCache
                .saveReport(report)
                .then(() => reportCache.getReport(report.key))
                .then((report) => {
                    report.key.should.equal('foobar123');
                    // eslint-disable-next-line no-unused-expressions
                    chai.expect(report.body).to.be.null;
                })
                .then(done)
                .catch(err => done(err));
        });

        it('sets and gets body correctly when valid JSON', (done) => {
            report = {
                key: 'foobar123',
                lastSequenceId: 1,
                body: { fruits: ['apples', 'oranges', 'bananas'] },
            };
            reportCache
                .saveReport(report)
                .then(() => reportCache.getReport(report.key))
                .then((report) => {
                    report.key.should.equal('foobar123');
                    report.body.should.eql({ fruits: ['apples', 'oranges', 'bananas'] });
                })
                .then(done)
                .catch(err => done(err));
        });
    });
});
