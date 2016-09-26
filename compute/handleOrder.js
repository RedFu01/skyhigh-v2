var mongojs = require('mongojs');
var db = mongojs('skyhigh');
var node_uuid = require('node-uuid');

var filterFlights = require('./filterFlights');
var useFilteredFlights = require('./useFilteredFlights');

function handleOrder(order){
    order.uuid = node_uuid.v4();
    order.ts = new Date();
    order.currentStepIndex = 0;
    order.finished = false;


    startOrder(order)
    handleSteps(order, null, (error)=>{
        if(error){
            endOrder(order.uuid, true);
        }else{
            endOrder(order.uuid, false);
        }
    })
}

function handleSteps(order, data, callback){
    let steps = order.steps;
    let currentStep = steps[order.currentStepIndex];
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