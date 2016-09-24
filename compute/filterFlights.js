function filterFlights(uuid, currentStep, lastStepData, callback){
    let outputCollection = 'filtered_flights_'+uuid;
    /*
        DO YOUR STUFF
    
     */

    console.log({
        uuid,
        currentStep,
        lastStepData,
    })
    callback(false,{outputCollection});
}

module.exports = filterFlights;