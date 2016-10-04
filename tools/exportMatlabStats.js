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

db.collection("network-stats-t_604193a9-40ee-4328-9be2-88a9587dd454").find({},(error,results)=>{
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
    fs.writeFile('./export/pathes_200nmi.json' , JSON.stringify(pathes), function (err) {
        console.log('Passout')
    });
});