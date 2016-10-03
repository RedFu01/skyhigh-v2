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
let finishCount =0;

function writeToFile(stat, callback){
    delete stat._id;
    fs.writeFile('./export/flight-' +stat.flightId + '.json' , JSON.stringify(stat), function (err) {
        callback();
    });
}

db.collection("network-stats-t_d1d52ede-1181-4c43-b56e-02b70434a58e").find({},(error,results)=>{
    mkdirp('./export', ()=>{
        for(let i=0; i< results.length;i++){
            writeToFile(results[i], ()=>{
                finishCount++;
                if(finishCount == results.length){
                    console.log('DONE')
                    // zipFolder('./export', './export.zip', function(err) {
                    //     if(err) {
                    //         console.log('oh no!', err);
                    //     } else {
                    //         console.log('EXCELLENT');
                    //     }
                    // });
                }
            })
        }
    })
})