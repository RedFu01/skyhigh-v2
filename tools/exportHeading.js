let utils = require('../utils/utils');
let mongojs = require('mongojs');
let Terraformer = require('terraformer');
let db = mongojs('skyhigh');
let uuid = require('node-uuid');
let ObjectId = db.ObjectId;
let hash = require('js-md5');
let fs = require('fs')
//let zipFolder = require('zip-folder');
let mkdirp = require('mkdirp');

let links = {};
let linkArray = []
let c =0;
let deltaT = 100;

const collectionUuid = "05/11/2016_600km_11e3ab6c-0362-43ab-ab48-ddd7427443ff";
let count =0;
let result=[];

function handleFlight(){
db.collection('filtered_flights_05/11/2016_600km_c765cdbe-7a02-433d-b6ca-eb09b0c0f2f8').find({}).skip(count).limit(1,(err, res)=>{
    if(res.length ==0){
        console.log('Writing')
        fs.writeFile('./export/raw_avg_headings.json' , JSON.stringify(result), function (err) {
            if(err)
            console.log(err)
            console.log('Passout')
        }); 
        return;
    }
    let tmp = res.map((flight)=>{
        let avg = 0;
        for(let i=0; i < flight.path.length; i++){
            avg += (flight.path[i].track || 0)
        }
        console.log(avg)
        return avg/flight.path.length;
    })
    result.push(tmp)
    count++;
    console.log('Did: ' + count);
    handleFlight();
})
}
handleFlight();

