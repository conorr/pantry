const Joi = require('joi');

const schema = Joi.object().keys({
    entityType: Joi.string().required(),
    entityId: Joi.string(),
    namespace: Joi.string(),
    type: Joi.string(),
});

module.exports = schema;
