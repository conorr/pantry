const Joi = require('joi');

const skuSchema = Joi.object().keys({
    invoiceDateUtc: Joi.date().required(),
    receivedDateUtc: Joi.date(),
    vendor: Joi.string().required(),
    invoice: Joi.string().required(),
    sku: Joi.string().required(),
    unitCost: Joi.number().positive().required(),
    unit: Joi.string().required(),
    startingQuantity: Joi.number().greater(0).required(),
    consumedQuantity: Joi.number().min(0).default(0),
    spoiledQuantity: Joi.number().min(0).default(0),
    shrankQuantity: Joi.number().min(0).default(0),
    deleted: Joi.boolean().default(false),
});

module.exports = skuSchema;
