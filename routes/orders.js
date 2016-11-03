"use strict";
var express = require('express');
var router = express.Router();
var handleOrder = require('../compute/handleOrder')

/* GET users listing. */
router.post('/', function(req, res, next) {

    // handleOrder({
    //     steps:[{
    //         type: 'USE_PATHES',
    //         collectionName: 'pathes-dev'
    //     },{
    //         type:'COMPUTE_NETWORK_STATS',
    //         flightCollection:'filtered_flights_dev',
    //         startTime: 1401580800,
    //         endTime: 1401580800 + 60*60*24,
    //         deltaT: 100,
    //         IGWs:[{
    //                 name:"Shannon Airport",
    //                 key:"IGW_EUROPE_00",
    //                 position: {
    //                     lat: 52.6996573,
    //                     lng: -8.9168798
    //                 }
    //             },{
    //                 name:"Gander Airport",
    //                 key:"IGW_AMERICA_00",
    //                 position: {
    //                     lat: 48.9418259,
    //                     lng: -54.5681016
    //                 }
    //             }]
    //     }]
    // })

    handleOrder({
        radius:'500nmi',
        steps:[{
            type:'FILTER_FLIGHTS',
            filters:{
                region:{
                    minLat: 45,
                    maxLat: 55,
                    minLng: -55,
                    maxLng: -8
                },
                startTime: 1401580800,
                endTime: 1401580800 + 60*60*24,
                minDuration: 60*60*2,
            }
        },{
            type:'COMPUTE_NETWORK',
            properties:{
                startTime: 1401580800,
                endTime: 1401580800 + 60*60*24,
                deltaT: 100,
                A2G_Radius: 92.6*5, // 250nmi
                A2A_Radius: 92.6*10, // 500nmi
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
        },{
            type:'COMPUTE_NETWORK_STATS',
            deltaT: 100,
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
