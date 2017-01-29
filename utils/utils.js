"use strict";
let moment = require('moment');
let Terraformer = require('terraformer')
var mongojs = require('mongojs');
let db = mongojs('skyhigh');
let uuid = require('node-uuid');
let ObjectId = db.ObjectId;

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

function addLeadingZero(num){
    return (num<10)?'0'+num:num;
}

function date2collection(date){
    var collection = 'flights-'+date.getFullYear();
    collection += '-'+addLeadingZero(date.getMonth());
    collection += '-'+addLeadingZero(date.getDate());
    return collection;    
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

function getFlightHeading(flight){
    let avg = 0;
        for(let i=0; i < flight.path.length; i++){
            avg += (flight.path[i].track || 0)
        }
    return avg/flight.path.length;
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

function computeCover(path){
	//return ['yey'];
	var minLat = path[0].pos.coordinates[0],
		maxLat = path[0].pos.coordinates[0],
		minLng = path[0].pos.coordinates[1],
		maxLng = path[0].pos.coordinates[1];
		 
	for(var i=1;i<path.length;i++){
		minLat = Math.min(minLat,path[i].pos.coordinates[0]);
		maxLat = Math.max(maxLat,path[i].pos.coordinates[0]);
		minLng = Math.min(minLng,path[i].pos.coordinates[1]);
		maxLng = Math.max(maxLng,path[i].pos.coordinates[1]);
	}
	var multipoint = new Terraformer.MultiPoint([ [minLng,minLat],[maxLng,maxLat],[minLng,maxLat],[maxLng,minLat] ]);
	//console.log(multipoint.convexHull());
	return multipoint.convexHull();
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
        if(!firstResult || firstResult.length ==0){
            callback(null);
            return;
        }
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
function getPositionAtMoment(flight, moment){
    var pos = null;
    var index =0;
    if(!flight){
        console.log('no Flight')
        return null;
    }

    if(flight.depatureTime > moment || flight.arrivalTime < moment){
        console.log('out of timebounds')
        return null;
    }
    
    while(moment > parseInt(flight.path[index].timestamp)){
        index++;
    }
    if(!flight.path[index] || !flight.path[index-1]){
        console.log('out of timebounds_2')
        return null;
    }
    var prevPos = {
        lat:flight.path[index-1].pos.coordinates[0],
        lng:flight.path[index-1].pos.coordinates[1],
        altitude : flight.path[index-1].altitude,
		horizontalSpeed : flight.path[index-1].horizontalSpeed,
		verticalSpeed: flight.path[index-1].verticalSpeed,
		track: flight.path[index-1].track,
        ts:parseInt(flight.path[index-1].timestamp)
    }
    var nextPos = {
        lat:flight.path[index].pos.coordinates[0],
        lng:flight.path[index].pos.coordinates[1],
        altitude : flight.path[index].altitude,
		horizontalSpeed : flight.path[index].horizontalSpeed,
		verticalSpeed: flight.path[index].verticalSpeed,
		track: flight.path[index].track,
        ts:parseInt(flight.path[index].timestamp)
    }
    pos = {
        lat: prevPos.lat + (nextPos.lat-prevPos.lat)*(nextPos.ts-moment)/(nextPos.ts-prevPos.ts),
        lng: prevPos.lng + (nextPos.lng-prevPos.lng)*(nextPos.ts-moment)/(nextPos.ts-prevPos.ts),
        altitude: prevPos.altitude + (nextPos.altitude-prevPos.altitude)*(nextPos.ts-moment)/(nextPos.ts-prevPos.ts),
		horizontalSpeed: prevPos.horizontalSpeed + (nextPos.horizontalSpeed-prevPos.horizontalSpeed)*(nextPos.ts-moment)/(nextPos.ts-prevPos.ts),
		verticalSpeed: prevPos.verticalSpeed + (nextPos.verticalSpeed-prevPos.verticalSpeed)*(nextPos.ts-moment)/(nextPos.ts-prevPos.ts),
		track: prevPos.track + (nextPos.track-prevPos.track)*(nextPos.ts-moment)/(nextPos.ts-prevPos.ts),
        ts:moment
    }
	return pos; 
}

function getTimeArray(startTime,endTime,deltaT){
    var tArray = [];
    var cTime = startTime;
    while(cTime < endTime){
        tArray.push(cTime);
        cTime += deltaT;
    }
    return tArray;
}

module.exports = {
    getCollectionArray,
    bounds2GeoJSON,
    getFlightDuration,
    getFlightDistance,
    getFullFlight,
    getTimeArray,
    getPositionAtMoment,
    getDistanceFromLatLonInKm,
    getFlightHeading
}