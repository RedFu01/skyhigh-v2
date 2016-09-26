let moment = require('moment');
let Terraformer = require('terraformer')

function getCollectionArray(startTime, endTime){
    let results = [];
    let _startDate = moment(startTime*1000).subtract(1,'d');
    let _endDate = moment(endTime*1000).add(1,'d');

    while(_startDate.isBefore(_endDate)){
        results.push('flights-'+_startDate.format('YYYY-MM-DD'));
        _startDate.add(1,'d');
    }
    return results;
}

function bounds2GeoJSON(minLat, maxLat, minLng, maxLng){
	var multipoint = new Terraformer.MultiPoint([ [minLng,minLat],[maxLng,maxLat],[minLng,maxLat],[maxLng,minLat] ]);
	return multipoint.convexHull();
}

function getFlightDuration(flight){
    let startTimestamp = parseInt(flight.path[0].timestamp)
    let endTimestamp = parseInt(flight.path[flight.path.length-1].timestamp)

    return endTimestamp - startTimestamp;
}

function getFlightDistance(flight){ // in meters
    let startPoint = flight.path[0].pos.coordinates
    let endPoint = flight.path[flight.path.length-1].pos.coordinates
    return getDistanceFromLatLonInKm(startPoint[0], startPoint[1], endPoint[0], endPoint[1])*1000;
}

function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
    let R = 6371; // Radius of the earth in km
	let dLat = deg2rad(lat2-lat1);  // deg2rad below
	let dLon = deg2rad(lon2-lon1); 
	let a = 
		Math.sin(dLat/2) * Math.sin(dLat/2) +
		Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
		Math.sin(dLon/2) * Math.sin(dLon/2) 
	let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
	let d = R * c; // Distance in km
	return d;
}
		
function deg2rad(deg) {
	return deg * (Math.PI/180);
}

function getNeighbourCollections(collection){
    var result = [];
    var collectionsParts = collection.split('-');
    var collectionDate = new Date(0);
    collectionDate.setFullYear(parseInt(collectionsParts[1]));
    collectionDate.setMonth(parseInt(collectionsParts[2]));
    collectionDate.setDate(parseInt(collectionsParts[3]));
    collectionDate.setDate(collectionDate.getDate()-1);
    result.push(date2collection(collectionDate))
    result.push(collection);
    collectionDate.setDate(collectionDate.getDate()+2)
    result.push(date2collection(collectionDate))
    return result;
}

function getFullFlight(collection, id, callback){
    var results =[];
    var finalFlight = {};
    
    var collectionArray = getNeighbourCollections(collection);
    
    db.collection(collection).find({_id:ObjectId(id)},function(error,firstResult){
        db.collection(collectionArray[0]).find({key:firstResult[0].key},function(error,res1){
            db.collection(collectionArray[2]).find({key:firstResult[0].key},function(error,res3){
                if(res1[0]){
                    results.push(res1[0])
                }
                results.push(firstResult[0])
                if(res3[0]){
                    results.push(res3[0])
                }
                if(results.length == 1){
                    callback(results[0])
                }else{
                finalFlight = JSON.parse(JSON.stringify(results[0]))
                finalFlight.path = results[0].path.concat(results[1].path)
                finalFlight.depatureTime = parseInt(finalFlight.path[0].timestamp)
                finalFlight.arrivalTime = parseInt(finalFlight.path[finalFlight.path.length-1].timestamp)
                finalFlight.cover= computeCover(finalFlight.path);
                callback(finalFlight)
                }
            
        })
        })
    })
    
    
}

module.exports = {
    getCollectionArray,
    bounds2GeoJSON,
    getFlightDuration,
    getFullFlight,
}