const ReportCache = require('./reportCache');
const { Database } = require('sqlite3');

const db = new Database('pantry.db');

const cache = new ReportCache(db);

cache.saveReport({
    cacheKey: 'report103214',
    reportBody: { foo: 'baz' },
    lastSequenceId: 32423,
});

cache.getReport('report103214').then(report => console.log(report));

