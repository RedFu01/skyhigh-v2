"use strict";
var express = require('express');
var router = express.Router();
var handleOrder = require('../compute/handleOrder');
let utils = require('../utils/utils');
let mongojs = require('mongojs');
let Terraformer = require('terraformer');
let db = mongojs('skyhigh', [], { connectTimeoutMS: 1000 * 60 * 20, socketTimeoutMS: 1000 * 60 * 20 })
let bfj = require('bfj');
let ObjectId = db.ObjectId;


router.post('/flights/', function (req, res, next) {
    let query = req.body;
    for(let key in query){
        if(query[key] == -1){
            query[key] = null;
        }
    }
    let order = {
        "radius": "API_REQUEST",
        "email": "konradfuger@gmail.com",
        "steps": [{
            "type": "FILTER_FLIGHTS",
            "filters": {
                "region": {
                    "minLat": query.minLat,
                    "maxLat": query.maxLat,
                    "minLng": query.minLng,
                    "maxLng": query.maxLng
                },
                "startTime": query.startTime,
                "endTime": query.endTime,
                "minDuration": query.minDuration,
                "minDistance": query.minDistance,
                "maxDistance": query.maxDistance,
                "overallMinHeading": query.overallMinHeading,
                "overallMaxHeading": query.overallMaxHeading,
                "minAltitude": query.minAltitude,
                "maxAltitude":  query.maxAltitude
            }
        }
        ]
    };
    let uuid = handleOrder(order, (error) => {
        console.log('ORDER EXECUTED')
    });
    res.json(
        {
            uuid,
            progress: 0,
        })
});

router.post('/flights/status', function (req, res, next) {
    db.collection('orders').find({ uuid: req.body.uuid }, (err, results) => {
        res.json({
            progress: results[0].finished ? 1 : 0
        })
    })
})

router.get('/flights/', function (req, res, next) {
    res.json({
        big: 'data'
    })
})

router.get('/flights/chunk', function (request, response, next) {
    var uuid = request.query.uuid;
    var startIndex = parseInt(request.query.start || 0);
    try {
        db.collection('filtered_flights_' + uuid).find({}).limit(200).skip(startIndex, (err, res) => {
            response.setHeader('Content-Type', 'application/json');
            response.write('[');
            res.map((entry, index) => {
                let f = Object.assign({}, entry);
                f.path = [];
                console.log(entry.arrivalTime, entry.depatureTime);
                console.log(request.query)
                for (let i = entry.depatureTime; i < entry.arrivalTime; i += (Number(request.query.deltat) || 10)) {
                    f.path.push(utils.getPositionAtMoment(entry, i));
                }
                response.write(JSON.stringify(f))
                if (index != res.length - 1) {
                    response.write(',')
                }
            })
            response.write(']');
            response.end();
        })
    } catch (e) {
        console.log('ERROR')
        response.json(e)
    }
});

module.exports = router;
