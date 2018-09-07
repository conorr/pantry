const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const { Database } = require('sqlite3');
const ReportCache = require('../../src/stores/reportCache');
const createTableSql = require('../../src/stores/reportCache/createTableSql');

/* eslint-disable no-undef */

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

    before((done) => {
        db = new Database(':memory:');
        reportCache = new ReportCache(db);
        createTable(db).then(done);
    });

    describe('getReport', () => {
        beforeEach((done) => {
            truncateTable(db).then(done);
        });

        it('gets a report', (done) => {
            reportCache.saveReport({
                cacheKey: 'foobar123',
                lastSequenceId: 9,
            })
                .then(() => reportCache.getReport('foobar123'))
                .then((report) => {
                    report.cacheKey.should.equal('foobar123');
                })
                .then(done)
                .catch(err => done(err));
        });

        it('returns undefined if the report is not found', (done) => {
            reportCache
                .getReport('xyz123')
                .then((report) => {
                    // eslint-disable-next-line no-unused-expressions
                    chai.expect(report).to.be.undefined;
                })
                .then(done)
                .catch(err => done(err));
        });

        it('throws if passed an undefined cache key', () => {
            const badCall = () => reportCache.getReport();
            badCall.should.throw();
        });
    });

    describe('saveReport', () => {
        beforeEach((done) => {
            truncateTable(db).then(done);
        });

        it('saves a report', (done) => {
            reportCache.saveReport({
                cacheKey: 'foobar123',
                lastSequenceId: 9,
            })
                .then(() => reportCache.getReport('foobar123'))
                .then((report) => {
                    report.cacheKey.should.equal('foobar123');
                })
                .then(done)
                .catch(err => done(err));
        });

        it('updates a report if the report already exists', (done) => {
            reportCache.saveReport({ cacheKey: 'foobar123', lastSequenceId: 9 })
                .then(() => reportCache.saveReport({ cacheKey: 'foobar123', lastSequenceId: 11 }))
                .then(() => reportCache.getReport('foobar123'))
                .then((report) => {
                    report.cacheKey.should.equal('foobar123');
                    report.lastSequenceId.should.equal(11);
                })
                .then(done)
                .catch(err => done(err));
        });

        it('throws if passed an invalid report', () => {
            const badCall = () => reportCache.saveReport({
                cacheKey: 'foobar123', // missing lastSequenceId
            });
            badCall.should.throw();
        });
    });

    describe('deleteReport', () => {
        it('deletes a report', (done) => {
            report = {
                cacheKey: 'foobar123',
                lastSequenceId: 1,
            };
            reportCache
                .saveReport(report)
                .then(() => reportCache.getReport('foobar123'))
                .then((report) => {
                    report.cacheKey.should.equal('foobar123');
                })
                .then(() => reportCache.deleteReport('foobar123'))
                .then(() => reportCache.getReport(report.cacheKey))
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
                cacheKey: 'foobar123',
                lastSequenceId: 1,
            };
            reportCache
                .saveReport(report)
                .then(() => reportCache.getReport(report.cacheKey))
                .then((report) => {
                    report.cacheKey.should.equal('foobar123');
                    // eslint-disable-next-line no-unused-expressions
                    chai.expect(report.body).to.be.null;
                })
                .then(done)
                .catch(err => done(err));
        });

        it('sets and gets body correctly when valid JSON', (done) => {
            report = {
                cacheKey: 'foobar123',
                lastSequenceId: 1,
                body: { fruits: ['apples', 'oranges', 'bananas'] },
            };
            reportCache
                .saveReport(report)
                .then(() => reportCache.getReport(report.cacheKey))
                .then((report) => {
                    report.cacheKey.should.equal('foobar123');
                    report.body.should.eql({ fruits: ['apples', 'oranges', 'bananas'] });
                })
                .then(done)
                .catch(err => done(err));
        });
    });
});
