function useFilteredFlights(uuid, currentStep, lastStepData, callback){
    let outputCollection = currentStep.collectionName;

    console.log({
        uuid,
        currentStep,
        lastStepData,
    })
    callback(false,{outputCollection});
}

module.exports = useFilteredFlights;