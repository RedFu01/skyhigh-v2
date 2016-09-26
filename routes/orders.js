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
                    minLat: 0,
                    maxLat: 30,
                    minLng: -90,
                    maxLng: 70
                },
                startTime: 1401696000 - 60*60*24,
                endTime: 1401696000 + 60*60*24,
                minDuration: 60*60*2,
            }
        },{
            type:'USE_FILTERED_FLIGHTS',
            collectionName: 'filtered_flights-uuid'
        }]
    })
    res.send('respond with a resource');
});

module.exports = router;
