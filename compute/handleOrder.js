"use strict";
var mongojs = require('mongojs');
let db = mongojs('skyhigh', [], {connectTimeoutMS: 1000*60*20, socketTimeoutMS: 1000*60*20})
var node_uuid = require('node-uuid');

var filterFlights = require('./filterFlights');
var useFilteredFlights = require('./useFilteredFlights');
var computeNetwork = require('./computeNetwork');
var computePathes = require('./computePathes');
var computeNetworkStats = require('./computeNetworkStats');
var usePathes = require('./usePathes');

function handleOrder(order, orderEndCallback){
    order.uuid = (order.radius + '_'|| '') + node_uuid.v4();
    order.ts = new Date();
    order.currentStepIndex = 0;
    order.finished = false;


    startOrder(order)
    handleSteps(order, null, (error)=>{
        if(error){
            endOrder(order.uuid, true);
            if(orderEndCallback){
                orderEndCallback(error)
            }
        }else{
            endOrder(order.uuid, false);
            if(orderEndCallback){
                orderEndCallback(error)
            }
        }
    })
    return order.uuid;
}

function handleSteps(order, data, callback){
    "use strict";
    let steps = order.steps;
    let currentStep = steps[order.currentStepIndex];
    console.log('Did ' + order.currentStepIndex + ' of ' + steps.length)
    if(order.currentStepIndex == steps.length){
        callback();
        return;
    }
    let stepCallback = (error, stepData)=>{
        order.currentStepIndex ++;
        if(error){
            callback(true);
            return;
        }
        handleSteps(order, stepData, callback);
    };
    switch(currentStep.type){
        case 'FILTER_FLIGHTS':
            filterFlights(order.uuid, currentStep, data, stepCallback);
            break;
        case 'USE_FILTERED_FLIGHTS':
            useFilteredFlights(order.uuid, currentStep, data, stepCallback);
            break;
        case 'COMPUTE_NETWORK':
            computeNetwork(order.uuid, currentStep, data, stepCallback);
            break;
        case 'USE_PATHES':
            usePathes(order.uuid, currentStep, data, stepCallback);
            break;
        case 'COMPUTE_PATHES':
            computePathes(order.uuid, currentStep, data, stepCallback);
            break;
        case 'COMPUTE_NETWORK_STATS':
            currentStep.flightCollection = 'filtered_flights_'+order.uuid;
            computeNetworkStats(order.uuid, currentStep, data, stepCallback);
            break;
        default:
            callback(true);

    }
}

function startOrder(order){
    db.collection('orders').insert(order);
}

function endOrder(uuid, error){
    db.collection('orders').update({uuid},{$set: {finished: true, error}})
}

module.exports = handleOrder;