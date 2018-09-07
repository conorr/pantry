const Joi = require('joi');

const schema = Joi.object().keys({
    sequenceIdStart: Joi.number().greater(0).default(0),
    top: Joi.number().max(100).min(1).default(100),
    entityType: Joi.string().token().min(1).max(255),
    entityId: Joi.string().token().min(1).max(255),
    type: Joi.string().token().min(1).max(255),
    namespace: Joi.string().token().max(255).allow(''),
});

const validateGetEventsRequest = (event) => {
    const result = Joi.validate(event, schema);
    if (result.error) throw new Error(result.error);
    return result.value;
};

module.exports = validateGetEventsRequest;
