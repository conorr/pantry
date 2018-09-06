const Joi = require('joi');

const schema = Joi.object().keys({
    invoiceDateUtc: Joi.date().required(),
    receivedDateUtc: Joi.date(),
    vendor: Joi.string().required(),
    invoice: Joi.string().required(),
    sku: Joi.string().required(),
    unitCost: Joi.number().positive().required(),
    unit: Joi.string().required(),
    startingQuantity: Joi.number().min(0).required(),
    consumedQuantity: Joi.number().min(0).required(),
    spoiledQuantity: Joi.number().min(0).required(),
    shrankQuantity: Joi.number().min(0).required(),
});

const validateSku = (sku) => {
    const result = Joi.validate(sku, schema);
    if (result.error) throw new Error(result.error);
};

module.exports = validateSku;
