const mysql = require('mysql');
const Joi = require('joi');
const validateEvent = require('./validateEvent');
const rowToEvent = require('./rowToEvent');

const pool = mysql.createPool({
    connectionLimit: 5,
    host     : 'localhost',
    user     : 'root',
    database : 'damoori'
});

const getEvent = (sequenceId) => {
    const query = `select * from events where sequence_id = ${sequenceId}`;
    return new Promise((resolve, reject) => {
        pool.getConnection((error, connection) => {
            if (error) reject(error);
            connection.query(query, (error, result) => {
                connection.release();
                if (error) reject(error);
                if (result.length === 0) return;
                const event = rowToEvent(result[0]);
                resolve(event);
            });
        });
    });
}

const getEvents = (sequenceIdStart=0, top=100) => {
    const query = `select * from events where sequence_id >= ${sequenceIdStart} limit ${top}`;
    return new Promise((resolve, reject) => {
        pool.getConnection((error, connection) => {
            if (error) reject(error);
            connection.query(query, (error, results) => {
                connection.release();
                if (error) reject(error);
                if (results.length === 0) return [];
                const events = results.map(rowToEvent);
                resolve(events);
            });
        });
    });
}

const saveEvent = (event) => {
    validateEvent(event);
    const bodySerialized = JSON.stringify(event.body);
    const query = `insert into events(type, version, body, created_utc) values ('${event.type}', ${event.version}, '${bodySerialized}', UTC_TIMESTAMP())`;
    pool.getConnection((error, connection) => {
        if (error) throw error;
        connection.query(query, (error) => {
            connection.release();
            if (error) throw error;
        });
    })
}

//saveEvent({ type: 'REMOVE_ITEM', version: 1, body: {foo: 'bar'}});
//getEvent(1).then(event => console.log(event));
getEvents().then(events => console.log(events));