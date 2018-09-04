const cacheKey = 'inventory_report';

const defaultReport = {};

const reportBodyreducer = (report, event) => {
    report.t = event;
    return report;
};

module.exports = {
    cacheKey,
    defaultReport,
    reportBodyreducer,
};
