const cacheKey = 'inventory_report';

const defaultReport = {};

const accumulator = (report, event) => {
    report.t = event;
    return report;
};

module.exports = {
    cacheKey,
    defaultReport,
    accumulator,
};
