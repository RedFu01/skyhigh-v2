function computeNetworkStats(uuid, currentStep, lastStepData, callback){
    let outputCollection = currentStep.collectionName;
    db.collection(lastStepData.outputCollection).find({}, (error, results)=>{
        for(let i=0; i< results.length; i++){ //loop through all the timestamps
            for(let ac_id in results[i].aircraft){

            }
        }
    })
    callback(false,{outputCollection});
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

let stat = {
    flightId:'someId',
    flightDuration: 123443,
    timeConnected:{
        IGW_EUROPE_00: 123,
        IGW_AMERICA_00: 576,
    },
    pathes:[
        {
            hash: '6sd678ds6d',
            connection: ['idgs7sdhd','8sd8c8dhsd88','IGW_EUROPE_00'],
            duration: 778,
            hops: 3
        }
    ]
}