const cacheKey = 'inventory_report';

const defaultReport = {};

const reducer = (report, event) => {
    report.t = event;
    return report;
};

module.exports = {
    cacheKey,
    defaultReport,
    reducer,
};
