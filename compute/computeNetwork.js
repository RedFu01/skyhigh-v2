"use strict";
let utils = require('../utils/utils');
let mongojs = require('mongojs');
let Terraformer = require('terraformer');
let db = mongojs('skyhigh', [], {connectTimeoutMS: 1000*60*20, socketTimeoutMS: 1000*60*20})
let uuid = require('node-uuid');
let ObjectId = db.ObjectId;


function computeNetwork(uuid, currentStep, lastStepData, callback) {
    let outputCollection = 'network-' + uuid;
    let {
        startTime,
        endTime,
        deltaT,
        A2G_Radius,
        A2A_Radius,
        IGWs,
        region
    } = currentStep.properties

    let timestamps = utils.getTimeArray(startTime, endTime, deltaT);
    let finishedCount = 0;

    db.collection(lastStepData.outputCollection).find({}, (error, flights) => {
        console.log('Found ' + flights.length + ' for nw')
        for (let i = 0; i < timestamps.length; i++) {
            let network = {
                _id: timestamps[i],
                aircraft: {}
            }
            let positionMap = {};
            for (let j = 0; j < flights.length; j++) {
                let currentPosition = utils.getPositionAtMoment(flights[j], timestamps[i])
                if(region){
                    if(utils.isInBounds(currentPosition, region)){
                        positionMap[flights[j]._id] = currentPosition;
                    }else{
                        console.log('not in region of interest');
                    }
                }else{
                    positionMap[flights[j]._id] = currentPosition;
                }
            }
            for (let id_1 in positionMap) {
                let f1_pos = positionMap[id_1];
                let neighbours = [];
                for (let id_2 in positionMap) {
                    let f2_pos = positionMap[id_2]
                    if (id_1 == id_2 || !f1_pos || !f2_pos) {
                        continue;
                    }

                    if (utils.getDistanceFromLatLonInKm(f1_pos.lat, f1_pos.lng, f2_pos.lat, f2_pos.lng) < A2A_Radius) {
                        neighbours.push(id_2);
                    }
                }
                for (let k = 0; k < IGWs.length; k++) {
                    if (f1_pos && utils.getDistanceFromLatLonInKm(f1_pos.lat, f1_pos.lng, IGWs[k].position.lat, IGWs[k].position.lng) < A2G_Radius) {
                        neighbours.push(IGWs[k].key);
                    }
                }
                if (neighbours.length > 0)
                    network.aircraft[id_1] = neighbours;
            }
            db.collection(outputCollection).insert(network, (error) => {
                if (error) {
                    console.log(error)
                }
                finishedCount++;
                console.log('network write: ' + finishedCount);
                if (finishedCount == timestamps.length) {
                    callback(false, { outputCollection });
                }
            })
        }
    })

}

module.exports = computeNetwork;