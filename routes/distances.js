"use strict";
var express = require('express');
var router = express.Router();
let utils = require('../utils/utils');
let mongojs = require('mongojs');
let Terraformer = require('terraformer');
let bfj = require('bfj');

/* GET users listing. */
router.get('/', function (req, response, next) {
    const db = req.query.db;
    const collection = req.query.collection;
    const skip = Number(req.query.skip);
    const limit = Number(req.query.limit);
    let database = mongojs(db, [], { connectTimeoutMS: 1000 * 60 * 20, socketTimeoutMS: 1000 * 60 * 20 })
    database[collection].find({}).skip(skip).limit(limit, (err, res) => {

        response.json(res.map(r => {
            const d = r.distances;
            return Object.keys(d).map(key => ({
                id: key,
                distance: d[key]
            }));
        }));
    })
});

module.exports = router;
