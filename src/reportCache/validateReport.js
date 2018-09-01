const Joi = require('joi');

const schema = Joi.object().keys({
    cacheKey: Joi.string().min(1).max(255).required(),
    lastSequenceId: Joi.number().integer(),
    reportBody: Joi.object(),
});

const validateReport = (report) => {
    const result = Joi.validate(report, schema);
    if (result.error) throw new Error(`Report validation: ${result.error}`);
};

module.exports = validateReport;