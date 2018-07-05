"use strict";
var express = require('express');
var router = express.Router();
let utils = require('../utils/utils');
let mongojs = require('mongojs');
let Terraformer = require('terraformer');
let moment = require('moment');

/* GET users listing. */
router.get('/', function (req, response, next) {
    try {
        const timestamp = Number(req.query.timestamp)
        const db = req.query.db || 'spot_rural_positions_200';
        const collection = req.query.collection || 'data_' + moment(timestamp * 1000).format('YYYY-MM-DD');
        let database = mongojs(db, [], { connectTimeoutMS: 1000 * 60 * 20, socketTimeoutMS: 1000 * 60 * 20 });

        console.log(timestamp, db, collection)
        database[collection].find({ ts: timestamp }, (err, res) => {

            if (res.length == 0) {
                response.json([]);
            } else {
                response.json(Object.keys(res[0].aircraft))
            }

            database.close();
        })
    } catch (error) {
        console.log(error)
        res.status(500).end();
        database.close();
    }
});

/* GET users listing. */
router.get('/full', function (req, response, next) {
    try {
        const timestamp = Number(req.query.timestamp)
        const db = req.query.db || 'spot_rural_positions_200';
        const collection = req.query.collection || 'data_' + moment(timestamp * 1000).format('YYYY-MM-DD');
        let database = mongojs(db, [], { connectTimeoutMS: 1000 * 60 * 20, socketTimeoutMS: 1000 * 60 * 20 });

        console.log(timestamp, db, collection)
        database[collection].find({ ts: timestamp }, (err, res) => {

            if (res.length == 0) {
                response.json([]);
            } else {
                response.json(Object.keys(res[0].aircraft).map(key =>{
                    const ac = res[0].aircraft[key];
                    ac.key = key;
                    return ac;
                }));
            }

            database.close();
        })
    } catch (error) {
        console.log(error)
        res.status(500).end();
        database.close();
    }
});

module.exports = router;