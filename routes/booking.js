var express = require('express');
var router = express.Router();
var mail = require('../utils/mailProvider')

/* GET users listing. */
router.get('/prepare', function(req, res, next) {
    let request = req.query
    mail.notify('HAPPYCAR Booking Prepare', JSON.stringify(request),request.customerEmail);
    console.log(request)
    res.json(request)
});

router.get('/complete', function(req, res, next) {
    let request = req.query
    mail.notify('HAPPYCAR Booking Complete', JSON.stringify(request),request.customerEmail);
    console.log(request)
    res.json(request)
});

module.exports = router;
