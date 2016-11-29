"use strict";
var express = require('express');
var router = express.Router();
let utils = require('../utils/utils');
let mongojs = require('mongojs');
let Terraformer = require('terraformer');
let db = mongojs('skyhigh', [], {connectTimeoutMS: 1000*60*20, socketTimeoutMS: 1000*60*20})
let bfj = require('bfj');
let ObjectId = db.ObjectId;

function recursiveStringify(res){
  return '[' + res.map(entry=>JSON.stringify(entry)).join(',') + ']'
}

/* GET users listing. */
router.get('/:uuid', function(request, response, next) {
  var uuid = request.params.uuid;
  db.collection('linkExport_'+uuid).find({}, (err, res) =>{
    bfj.stringify(res).then(str => {
      response.json(str)
    })
  })
});
router.get('/', function(request, response, next) {
  var uuid = request.query.uuid;
  try{
    db.collection('linkExport_'+uuid).find({}, (err, res) =>{
      console.log('got everything')
      response.write('[');
      res.map(entry=>response.write(JSON.stringify(entry)))
      response.write(']');
      response.end();
      //response.json(recursiveStringify(res));
      // bfj.stringify(res).then(str => {
      //   response.json(str)
      // }).catch((e) =>{
      //   response.json(e)
      // })
    })
  }catch(e){
    response.json(e)
  }
});

module.exports = router;
