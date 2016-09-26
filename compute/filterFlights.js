let utils = require('../utils/utils');
let mongojs = require('mongojs');
let Terraformer = require('terraformer');
let db = mongojs('skyhigh');
let uuid = require('node-uuid');
let ObjectId = db.ObjectId;


function filterFlights(uuid, currentStep, lastStepData, callback){
    let outputCollection = 'filtered_flights_'+uuid;
    let flights = [];
    let tmpFlights = [];
    let {
        region,                         // {minLat, maxLat, minLng, maxLng}
        startTime,                      // Unix timestamp
        endTime,                        // Unix timestamp
        minDuration,                    // in seconds
        maxDuration,                    // in seconds
        minDistance,                    // in meters
        maxDistande,                    // in meters
        overallMinHeading,  
        overallMaxHeading,
        } = currentStep.filters;

        let collectionNames = utils.getCollectionArray(startTime,endTime);
        let geometry = utils.bounds2GeoJSON(region.minLat, region.maxLat, region.minLng, region.maxLng);
        let finishedCollections = 0;
        let finishedFlights = 0;

        console.log(geometry)
        for(let i=0; i< collectionNames.length; i++){
            db.collection(collectionNames[i]).find({
                depatureTime:{'$lt': endTime},
                arrivalTime:{'$gt': startTime},
				// cover:{
				// 	$geoIntersects:{
				// 		$geometry:geometry
				// 	}
                // }
            }, (error, results)=>{
                console.log(error)
                tmpFlights.concat(results);
                console.log(tmpFlights.length)
                finishedCollections++;
                if(finishedCollections == collectionNames.length){
                    console.log('DONE')
                    for(let k =0; k< tmpFlights.length; k++){
                        utils.getFullFlight(collectionNames[i], tmpFlights[k]._id, (flights)=>{
                            flights.push(flight)
                            finishedFlights ++;
                            if(finishedFlights == tmpFlights.length){
                                flights = flights.filter((flight)=>{
                                    let distance = utils.getFlightDistance(flight);
                                    let duration = utils.getFlightDistance(flights)
                                    if(minDistance && distance < minDistance){
                                        return false;
                                    }
                                    if(maxDistance && distance > maxDistance){
                                        return false;
                                    }
                                    if(minDuration && duration < minDuration){
                                        return false;
                                    }
                                    if(maxDuration && duration > maxDuration){
                                        return false;
                                    }

                                    return true;
                                })
                                let bulk = db.collection(outputCollection).initializeOrderedBulkOp()
                                
                                for(let j = 0; j <flights.length; j++){
                                    bulk.insert(flights[j]);
                                }

                                bulk.execute((err, res) =>  {
                                    callback(false,{outputCollection});
                                })
                            }
                        })
                    }

                }
            })
        }

}

module.exports = filterFlights;