"use strict";
var express = require('express');
var router = express.Router();
var handleOrder = require('../compute/handleOrder')

/* GET users listing. */
router.get('/', function(req, res, next) {

    handleOrder({
        steps:[{
            type:'FILTER_FLIGHTS',
            filters:{
                region:{
                    minLat: 45,
                    maxLat: 55,
                    minLng: -55,
                    maxLng: -8
                },
                startTime: 1401577187 - 60*60*4,
                endTime: 1401577187 + 60*60*4,
                minDuration: 60*60*2,
            }
        },{
            type:'COMPUTE_NETWORK',
            properties:{
                startTime: 1401577187 - 60*60*4,
                endTime: 1401577187 + 60*60*4,
                deltaT: 100,
                A2G_Radius: 416.7, // 225nmi
                A2A_Radius: 2 * 416.7, //450nmi
                IGWs:[{
                    name:"Shannon Airport",
                    key:"IGW_EUROPE_00",
                    position: {
                        lat: 52.6996573,
                        lng: -8.9168798
                    }
                },{
                    name:"Gander Airport",
                    key:"IGW_AMERICA_00",
                    position: {
                        lat: 48.9418259,
                        lng: -54.5681016
                    }
                }]
            }
        },{
            type:'COMPUTE_PATHES',
            IGWs:[{
                    name:"Shannon Airport",
                    key:"IGW_EUROPE_00",
                    position: {
                        lat: 52.6996573,
                        lng: -8.9168798
                    }
                },{
                    name:"Gander Airport",
                    key:"IGW_AMERICA_00",
                    position: {
                        lat: 48.9418259,
                        lng: -54.5681016
                    }
                }]
        }]
    })
    res.send('respond with a resource');
});

module.exports = router;
