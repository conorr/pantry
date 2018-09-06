const express = require('express');
const { Database } = require('sqlite3');
const EventStore = require('../../stores/eventStore/eventStore');
const validateSku = require('./validateSku');

const router = express.Router();

router.post('/', (req, res) => {
    const sku = req.body;
    try {
        validateSku(sku);
    } catch (e) {
        res.status(400).send(e.message);
        return;
    }

    const db = new Database('pantry.db');
    const eventStore = new EventStore(db);
    eventStore.saveEvent({
        type: 'SKU_ADDED',
        namespace: 'sku',
        body: req.body,
    })
        .then(() => res.status(201).send('CREATED'));
});

module.exports = router;
