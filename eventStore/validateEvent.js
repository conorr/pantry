const Joi = require('joi');

const schema = Joi.object().keys({
    type: Joi.string().token().min(1).max(255)
        .required(),
    version: Joi.number().integer().greater(0),
    body: Joi.object(),
});

const validateEvent = (event) => {
    const result = Joi.validate(event, schema);
    if (result.error) throw new Error(`Event validation: ${result.error}`);
};

module.exports = validateEvent;
