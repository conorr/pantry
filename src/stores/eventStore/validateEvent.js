const Joi = require('joi');

const schema = Joi.object().keys({
    type: Joi.string().token().min(1).max(255)
        .required(),
    entityType: Joi.string().token().min(1).max(255),
    entityId: Joi.string().token().min(1).max(255),
    version: Joi.number().integer().greater(0),
    namespace: Joi.string().token().max(255).allow(''),
    body: Joi.object(),
});

const validateEvent = (event) => {
    const result = Joi.validate(event, schema);
    if (result.error) throw new Error(`Event validation: ${result.error}`);
};

module.exports = validateEvent;
