var mongojs = require('mongojs');
var Terraformer = require('terraformer');
var db = mongojs('skyhigh');
var StartTime = new Date();
var uuid = require('node-uuid');
var mail =require('./mailProvider');
var ObjectId = db.ObjectId;

function addLeadingZero(num){
    return (num<10)?'0'+num:num;
}

function date2collection(date){
    var collection = 'flights-'+date.getFullYear();
    collection += '-'+addLeadingZero(date.getMonth());
    collection += '-'+addLeadingZero(date.getDate());
    return collection;    
}

function getCollectionArray(collection){
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

function getFullFlight(collection, id, callback){
    var results =[];
    var finalFlight = {};
    
    var collectionArray = getCollectionArray(collection);
    
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
module.exports={
    getFullFlight: getFullFlight,
    getCollectionArray: getCollectionArray,
    date2collection: date2collection
}