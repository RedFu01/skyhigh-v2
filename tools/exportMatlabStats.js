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


db.collection("network-stats-t_d1d52ede-1181-4c43-b56e-02b70434a58e").find({},(error,results)=>{
    for(let i=0; i< results.length; i++){
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