const createEventsTableSql = require('../../src/stores/eventStore/createTableSql');
const createReportCacheTableSql = require('../../src/stores/reportCache/createTableSql');

const setUpDatabase = db => (
    new Promise((resolve, reject) => {
        db.run(createEventsTableSql, (err1) => {
            if (err1) reject(err1);
            db.run(createReportCacheTableSql, (err2) => {
                if (err2) reject(err2);
                resolve();
            });
        });
    })
);

const truncateTables = db => (
    new Promise((resolve, reject) => {
        db.run('DELETE FROM events;', (err1) => {
            if (err1) reject(err1);
            db.run('DELETE FROM report_cache;', (err2) => {
                if (err2) reject(err2);
                resolve();
            });
        });
    })
);

module.exports = {
    setUpDatabase,
    truncateTables,
};

