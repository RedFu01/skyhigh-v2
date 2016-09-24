var express = require('express');
var router = express.Router();
var handleOrder = require('../compute/handleOrder')

/* GET users listing. */
router.get('/', function(req, res, next) {

    handleOrder({
        steps:[{
            type:'FILTER_FLIGHTS'
        },{
            type:'USE_FILTERED_FLIGHTS',
            collectionName: 'filtered_flights-uuid'
        }]
    })
    res.send('respond with a resource');
});

module.exports = router;
