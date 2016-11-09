# Skyhigh v2

### Preface

This Repository contains software for academic use. It is designed to compute different analytics for aircraft position data. The following explains the architecture and usage of the software.


### Software and Libraries

Software used in this project:
* MongoDB
* nodeJS 6.2.0
* several libraries listed in the `package.json`



### Usage

This section describes the two ways to use this software.

#### Commandline mode

In commandline mode the entry point for this software is the `tools/executeOrder.js` file. It takes as first commandline argument the relative path from the script file to a JSON file containing a order to be executed. Those orders should be located in the `orders` folder. To use the script several nodeJS commandline flags are needed to make sure it gets enough RAM and is able to interpret ES6 syntax. An example call looks like this:

`node --use_strict --harmony --max-old-space-size=30000 executeOrder.js ../orders/firstOrder.json`

#### Server mode

There is also a server mode where you can pass a order with a POST request to `http://baseUrl/orders`.


### Orders

A order is a JSON string which contains the steps the system should execute as well as additional information.
This is how an example order looks like:

```
{
    "radius":"600km",
    "email": "konradfuger@gmail.com",
    "steps":[...]
}
```

The `radius` is a string which is not used for computing but to describe the order. When the order is finished a email is sent to the adress specified in `email`. The steps array contains objects. Those steps are executed one after another. Every step creates an new mongoDB collection with its output data. The collection is named according to the type of the step.

#### Steps

The only thing all steps have in common is the `type` property. It says which script is used to execute this step. There are 6 different types:

* 'FILTER_FLIGHTS'
* 'USE_FILTERED_FLIGHTS'
* 'COMPUTE_NETWORK'
* 'COMPUTE_PATHES'
* 'USE_PATHES'
* 'COMPUTE_NETWORK_STATS'

Each steps takes different additional data to perform its task.

##### 'FILTER_FLIGHTS'

```
{
  "type":"FILTER_FLIGHTS",
  "filters":{
    "region":{
      "minLat": 45,
      "maxLat": 55,
      "minLng": -55,
      "maxLng": -8
    },
    "startTime": 1401580800,
    "endTime": 1401667200,
    "minDuration": 7200
  }
}
```
This step is used to filter a subset of all flight data. it takes a rectangular region, a startTime and endTime as UNIX timestamps as well as a minDuration in seconds.

##### 'USE_FILTERED_FLIGHTS'
```
{
  "type": "USE_FILTERED_FLIGHTS",
  "collectionName": "pathes-dev"
}
```

If the filter part of the current order was already executed in a previous order it is possible to use this steps to use the filtered data from a previous calculation.

##### 'COMPUTE_NETWORK'
```
{
  "type":"COMPUTE_NETWORK",
  "properties":{
    "startTime": 1401580800,
    "endTime": 1401667200,
    "deltaT": 100,
    "A2G_Radius": 300,
    "A2A_Radius": 600, 
    "IGWs":[{
      "name":"Shannon Airport",
      "key":"IGW_EUROPE_00",
      "position": {
        "lat": 52.6996573,
        "lng": -8.9168798
       }
     }, ... ]
  }
}
```

This steps converts the filtered flights into a network. It describes for every timestep between startTime and endTime for every aircraft which other aircraft or internet gateways (IGWs) are in communication range.

##### 'COMPUTE_PATHES'
```
{
  "type":"COMPUTE_PATHES",
  "IGWs":[{
    "name":"Shannon Airport",
    "key":"IGW_EUROPE_00",
    "position": {
      "lat": 52.6996573,
      "lng": -8.9168798
     }
   }, ... ]
}
```

In this steps a previous created network is used to calculate the shortest pathes from every aircraft to every IGW for every timestamp. To be more efficient it loops through every timestep and if the shortest path from the last timestep still exists it does not look again for a shortest path.

##### 'USE_PATHES'
```
{
  "type":"USE_PATHES",
  "collectionName": "pathes-dev"
}
```

This one again is a shortcut to pick off a previously executed order and use the pathes calculated there.

##### 'COMPUTE_NETWORK_STATS'
```
{
  "type":"COMPUTE_NETWORK_STATS",
  "deltaT": 300,
  "IGWs":[{
    "name":"Shannon Airport",
    "key":"IGW_EUROPE_00",
    "position": {
      "lat": 52.6996573,
      "lng": -8.9168798
     }
   }, ... ]
}
```

In this step the final insights for the computation are created. It takes the computed pathes and analyzes them in regards to the number of hops and the time every path stays active.


### Program flow

The heart piece of the application is the `compute/handleOrder.js` file. It analyzes the order and executes the steps in a sequence. The software is designed that every step creates an output collection as well as additional information which is passed to the next step. In this way every computation can be reused or resumed in case of a crash. Also the system stores all orders in a designated collection and marks them as finished when the execution comes to an end. This can be used to investigate old orders or implement a waiting queue for several orders (in the moment all orders are executed in parallel). If an error occurs the execution of the order terminates, the error is stored in the database and a mail is sent which says that the order could not be completet.


### Export

In the `export` folder is a variety of scripts which can be used to generate JSON files from an order which can be interpreted further interpreted by matlab scripts in the `matlab` folder. Those export scripts are not configurable by commanline arguments. The needed collection an output files have to be added in code. 
