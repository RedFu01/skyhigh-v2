"use strict";
let utils = require('../utils/utils');
let mongojs = require('mongojs');
let Terraformer = require('terraformer');
let db = mongojs('skyhigh', [], {connectTimeoutMS: 1000*60*20, socketTimeoutMS: 1000*60*20})
let uuid = require('node-uuid');
let jsnx = require('jsnetworkx');
let ObjectId = db.ObjectId;


function computePathes(uuid, currentStep, lastStepData, callback){
    let outputCollection = 'pathes-' + uuid;
    let GW_keys = currentStep.IGWs.map((IGW => IGW.key));
    let prevPathes = {};
    let finishedTimestamps = 0;

    db.collection(lastStepData.outputCollection).find({},(error, networks) => {
        for(let i=0; i< networks.length; i++){
            let network = networks[i]
            let timestamp = networks[i]._id;
            let G = new jsnx.Graph();
            for(var flightId in network.aircraft){
                for(var j=0; j< network.aircraft[flightId].length; j++){
                    G.addEdge(flightId,network.aircraft[flightId][j]);
                }
            }
            let pathes = {};
            for(let ac_id in network.aircraft){
                pathes[ac_id]={};
                let oldPath = prevPathes[ac_id]
                    for(let k=0; k<GW_keys.length; k++){
                        let GW_key = GW_keys[k]
                        if(oldPath && oldPath[GW_key] && pathExists(oldPath[GW_key], network.aircraft)){
                            pathes[ac_id][GW_key] = oldPath[GW_key];
                        }else{
                            try{
                                pathes[ac_id][GW_key] = jsnx.shortestPath(G, {source: ac_id, target: GW_key})
                            }
                            catch(e){
                            }
                        }
                    }
            }
            db.collection(outputCollection).insert({_id: timestamp, pathes}, (err)=>{
                finishedTimestamps++;
                if(finishedTimestamps == networks.length){
                    callback(false,{outputCollection});
                }
            })
            prevPathes = pathes;
        }
    })
}

function pathExists(path, network){
    for(var i=1; i< path.length; i++){
        if(!network[path[i-1]] || network[path[i-1]].indexOf(path[i]) == -1){
            return false;
        }
    }
    return true;
}

module.exports = computePathes;