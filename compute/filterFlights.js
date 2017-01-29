"use strict";
let utils = require('../utils/utils');
let mongojs = require('mongojs');
let Terraformer = require('terraformer');
let db = mongojs('skyhigh', [], {connectTimeoutMS: 1000*60*20, socketTimeoutMS: 1000*60*20})
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
        maxDistance,                    // in meters
        overallMinHeading,  
        overallMaxHeading,
        } = currentStep.filters;

        let collectionNames = utils.getCollectionArray(startTime,endTime);
        let geometry = utils.bounds2GeoJSON(region.minLat, region.maxLat, region.minLng, region.maxLng);
        let finishedCollections = 0;
        let finishedFlights = 0;

        for(let i=0; i< collectionNames.length; i++){
            db.collection(collectionNames[i]).find({
				depatureTime:
                   {$lt: endTime },
				arrivalTime:
					{$gt: startTime},
				cover:{
					$geoIntersects:{
						$geometry:geometry
					}
                }
            },{_id: true}, (error, results)=>{
                finishedCollections++;
                if(error){
                    console.log(error)
                    return;
                }
                tmpFlights = tmpFlights.concat(results);
                console.log('Found '+ results.length);
                if(finishedCollections == collectionNames.length){
                    console.log(tmpFlights.length)
                    for(let k =0; k< tmpFlights.length; k++){
                        utils.getFullFlight(collectionNames[i], (tmpFlights[k])._id, (flight)=>{
                            if(flight){
                                flights.push(flight)
                            }
                            finishedFlights ++;
                            if(finishedFlights == tmpFlights.length){
                                flights = flights.filter((flight)=>{
                                    let distance = utils.getFlightDistance(flight);
                                    let duration = utils.getFlightDuration(flight);
                                    let heading = utils.getFlightHeading(flight);
                                    console.log(heading);
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
                                    if(heading && heading <= overallMinHeading){
                                        return false;
                                    }
                                    if(heading && heading >= overallMaxHeading){
                                        return false;
                                    }

                                    return true;
                                })
                                //let bulk = db.collection(outputCollection).initializeOrderedBulkOp()
                                let flightsFinishedCount =0;
                                for(let j = 0; j <flights.length; j++){
                                    //bulk.insert(flights[j]);
                                    db.collection(outputCollection).insert(flights[j],()=>{
                                        flightsFinishedCount++;
                                        if(flightsFinishedCount == flights.length){
                                            callback(false,{outputCollection});
                                        }
                                    });
                                }

                                // bulk.execute((err, res) =>  {
                                //     callback(false,{outputCollection});
                                // })
                            }
                        })
                    }

                }
            })
        }

}

module.exports = filterFlights;