var db = require('./dbProvider');
var data = require('./dataProvider');
var Terraformer = require('terraformer');
var mail = require('./mailProvider');

var lineCounter = 0;
var totalLines = 0;
var dbCounter = 0;
var started = false;
var finished = false;
var errorCounter = 0;

var interval;

var Aircrafts = [];
var Flights = {};
var flightLength = 0;
var Routes = [];
var time = [];

var aircaftsStored = 0;
var flightsStored = 0;
var routesStored = 0;
var tempflightLength = 0;
var tempAircrafts = [];
var tempRoutes = [];

function init(){
 lineCounter = 0;
 totalLines = 0;
 dbCounter = 0;
 started = false;
 finished = false;
 Aircrafts = [];
 Flights = {};
 flightLength = 0;
 Routes = [];
 time = [];

 aircaftsStored = 0;
 flightsStored = 0;
 routesStored = 0;
 tempflightLength = 0;
 tempAircrafts = [];
 tempRoutes = [];
}

function insertAircraft(registration, aircraftType) {
  var aircraft = {
    registration: registration,
    type: aircraftType
  }
  var index = Aircrafts.indexOf(aircraft);
  if (index == -1) {
    Aircrafts.push(aircraft);
    return (Aircrafts.length - 1);
  } else {
    return index;
  }
}
function insertRoute(startAirport, endAirport, flightnumber) {
  var route = {
    startAirport: startAirport,
    endAirport: endAirport,
    flightNumber: flightnumber
  }
  var index = Routes.indexOf(route);
  if (index == -1) {
    Routes.push(route);
    return (Routes.length - 1);
  } else {
    return index;
  }
}

function pointIsInPath(point, path) {
  for (var i = 0; i < path.length; i++) {
    if (path[i].timestamp == point.timestamp) {
      errorCounter++;
      return true;
    }
  }
}

function storeData(flightPoint, callback) {
  var wayPoint = {
    timestamp: flightPoint.timestamp,
    altitude: flightPoint.altitude,
    horizontalSpeed: flightPoint.horizontalSpeed,
    verticalSpeed: flightPoint.verticalSpeed,
    track: flightPoint.track,
    pos: new Terraformer.Primitive({
          type:"Point",
          coordinates:[flightPoint.lat, flightPoint.lng]
    })
  };

  if (!Flights[flightPoint.key]) {
    Flights[flightPoint.key] = {
      aircraft: flightPoint.registration,
      route: flightPoint.internationalFlightNumber,
      path: [wayPoint]
    }
    flightLength++;
  } else {
    if (!pointIsInPath(wayPoint, Flights[flightPoint.key].path)) {
      Flights[flightPoint.key].path.push(wayPoint);
    }
  }
  callback();
}


function processData(dateString,finishCallback){
  mail.notify('DBWriter: '+dateString,'started another document')
  init();
  db.init(dateString);
  data.readLines(dateString,function(line) {
  var flightpoint = (data.parseEntry(data.line2Array(line)));

  storeData(flightpoint, function() {
    lineCounter++;
    totalLines++;
  });
  if(lineCounter > 10000000){
    started = true;
    tempflightLength = flightLength;
    //flightLength =0;
    var tempFlights = Flights
    Flights = {};
     for (var key in tempFlights) {
       data.stop();
      var flight = tempFlights[key];
      db.insertFlight(key, flight.aircraft, flight.route, flight.path, function() {
        flightsStored++;
      })
      //data.resume();
    }
  }
}, function(){
  tempflightLength = flightLength;
    started = true;
    finished = true;
      for (var key in Flights) {
      var flight = Flights[key];
      db.insertFlight(key, flight.aircraft, flight.route, flight.path, function() {
        flightsStored++;
      })
    }
})
clearInterval(interval);
interval = setInterval(function() {
  console.log(new Date() + ' Read: ' + totalLines + ' | Wrote:  Flights(' + flightsStored + ' of ' + tempflightLength + ') Errors: '+errorCounter);

  if (started && Math.abs(flightsStored - tempflightLength) <=2) {
    data.resume();
    lineCounter = 0;
    tempAircrafts = [];
    tempRoutes = [];
    started = false;
    if(finished){
      finishCallback();
      
    }

  }
}, 2000)
}


try{
processData('2012-06-02',function(){
  mail.notify('DBWriter: Finished','All tasks done, Sir. Errors: '+errorCounter);
});

}catch(e){
  mail.notify('DBWriter: Try/Catch',JSON.stringify(e));
}


