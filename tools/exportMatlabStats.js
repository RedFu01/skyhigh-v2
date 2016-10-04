let utils = require('../utils/utils');
let mongojs = require('mongojs');
let Terraformer = require('terraformer');
let db = mongojs('skyhigh');
let uuid = require('node-uuid');
let ObjectId = db.ObjectId;
let hash = require('js-md5');
let fs = require('fs')
//let zipFolder = require('zip-folder');
let mkdirp = require('mkdirp');

let pathes = [];
let connectionDurations = []

db.collection("network-stats-t_b2b33807-26b9-4bc4-8a80-953e40daa490").find({},(error,results)=>{
    for(let i=0; i< results.length; i++){
        connectionDurations.push({
            flightDuration: results[i]
        })
        for(hash in results[i].pathes){
            pathes.push({
                hops: results[i].pathes[hash].hops,
                duration: results[i].pathes[hash].duration
            })
        }
    }
    fs.writeFile('./export/pathes.json' , JSON.stringify(pathes), function (err) {
        console.log('Passout')
    });
});