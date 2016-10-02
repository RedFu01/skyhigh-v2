"use strict";
let utils = require('../utils/utils');
let mongojs = require('mongojs');
let Terraformer = require('terraformer');
let db = mongojs('skyhigh');
let uuid = require('node-uuid');
let ObjectId = db.ObjectId;
let hash = require('js-md5');

function computeNetworkStats(uuid, currentStep, lastStepData, callback){
    let outputCollection  = 'network-stats-' + uuid;
    db.collection(outputCollection).drop();
    let stats = {};
    let insertCount = 0;
    db.collection(currentStep.flightCollection).find({}, (error, flights)=>{
        for(let i=0; i< flights.length; i++){
            let duration = utils.getFlightDuration(flights[i])
            let timeconnected = {}
            for(let j=0; j< currentStep.IGWs.length; j++){
                timeconnected[currentStep.IGWs[j].key] = 0;
            }
            stats[flights[i]._id]={
                flightId:flights[i]._id,
                flightDuration: duration,
                timeConnected: timeconnected,
                pathes:{}
            }
        }
        db.collection(lastStepData.outputCollection).find({}, (error, results)=>{
            for(let i=0; i< results.length; i++){ //loop through all the timestamps
                for(let ac_id in results[i].pathes){
                    for(let igw in results[i].pathes[ac_id]){
                        stats[ac_id].timeConnected[igw]+=currentStep.deltaT;
                        let pathHash = hash(results[i].pathes[ac_id][igw])
                        if(!stats[ac_id].pathes[pathHash]){
                            stats[ac_id].pathes[pathHash] = {
                                hash: pathHash,
                                connection: results[i].pathes[ac_id][igw],
                                duration: currentStep.deltaT,
                                hops: results[i].pathes[ac_id][igw].length
                            }
                        }else{
                            stats[ac_id].pathes[pathHash].duration += currentStep.deltaT;
                        }
                    }
                }
            }
            for(let stat in stats){
                db.collection(outputCollection).insert(stats[stat], ()=>{
                    insertCount ++;
                    if(insertCount == Object.keys(stats).length){
                        callback(false,{outputCollection});
                    }
                })
            }
        })
    })

    
}

module.exports = computeNetworkStats;
/**
 * -> for every flight
 * 1. Get Flight duration
 * 2. Get Duration connected for every GW
 * 3. Get all the pathes
 * 
 * 
 */

// let stat = {
//     flightId:'someId',
//     flightDuration: 123443,
//     timeConnected:{
//         IGW_EUROPE_00: 123,
//         IGW_AMERICA_00: 576,
//     },
//     pathes:[
//         {
//             hash: '6sd678ds6d',
//             connection: ['idgs7sdhd','8sd8c8dhsd88','IGW_EUROPE_00'],
//             duration: 778,
//             hops: 3
//         }
//     ]
// }