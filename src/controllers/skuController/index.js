const express = require('express');
const Joi = require('joi');
const { Database } = require('sqlite3');
const EventStore = require('../../stores/eventStore');
const skuSchema = require('../../services/skuService/skuSchema');

const router = express.Router();

router.post('/', (req, res) => {
    const rawSku = req.body;
    const result = Joi.validate(rawSku, skuSchema);
    if (result.error) {
        res.status(400).send(result.error.message);
        return;
    }
    const sku = result.value;

    const db = new Database('pantry.db');
    const eventStore = new EventStore(db);
    eventStore.saveEvent({
        type: 'SKU_ADDED',
        namespace: 'sku',
        body: sku,
    })
        .then(() => res.status(201).send('CREATED'));
});

module.exports = router;
