"use strict";
var express = require('express');
var router = express.Router();
let utils = require('../utils/utils');
let mongojs = require('mongojs');
let Terraformer = require('terraformer');
let bfj = require('bfj');

/* GET users listing. */
router.get('/', function (req, response, next) {
    try {
        const db = req.query.db;
        const collection = req.query.collection;
        //const skip = Number(req.query.skip);
        //const limit = Number(req.query.limit);
        const timestamp = Number(req.query.timestamp)
        let database = mongojs(db, [], { connectTimeoutMS: 1000 * 60 * 20, socketTimeoutMS: 1000 * 60 * 20 })
        database[collection].find({ ts: timestamp }, (err, res) => {

            response.json(res);
            database.close();
        })
    } catch (error) {
        console.log(error)
        res.status(500).end();
    }
});

router.get('/center', function (req, response, next) {
    try {
        const db = req.query.db;
        const collection = req.query.collection;
        let database = mongojs(db, [], { connectTimeoutMS: 1000 * 60 * 20, socketTimeoutMS: 1000 * 60 * 20 })
        database[collection].find({}, (err, res) => {

            response.json(res[0]);
            database.close();
        })
    } catch (error) {
        console.log(error)
        res.status(500).end();
    }
});

module.exports = router;