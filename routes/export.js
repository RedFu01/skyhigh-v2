"use strict";
var express = require('express');
var router = express.Router();
let utils = require('../utils/utils');
let mongojs = require('mongojs');
let Terraformer = require('terraformer');
let db = mongojs('skyhigh', [], {connectTimeoutMS: 1000*60*20, socketTimeoutMS: 1000*60*20})

let ObjectId = db.ObjectId;

/* GET users listing. */
router.get('/:uuid', function(request, response, next) {
  var uuid = request.params.uuid;
  db.collection('linkExport_'+uuid).find({}, (err, res) =>{
    response.json(res)
  })
});
router.get('/', function(request, response, next) {
  var uuid = request.query.uuid;
  db.collection('linkExport_'+uuid).find({}, (err, res) =>{
    response.json(res)
  })
});

module.exports = router;
