function usePathes(uuid, currentStep, lastStepData, callback){
    let outputCollection = currentStep.collectionName;


    callback(false,{outputCollection});
}

module.exports = usePathes;