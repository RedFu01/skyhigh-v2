let utils = require('../utils/utils');
let mongojs = require('mongojs');
let Terraformer = require('terraformer');
let db = mongojs('skyhigh');
let uuid = require('node-uuid');
let ObjectId = db.ObjectId;
let hash = require('js-md5');
let fs = require('fs')

let gti = 103;

function doit(ti, callback){

db.collection("network-t_58c8f326-4814-4ad7-bfd7-0be4be933d2b").find({},(err, results)=>{
    let network = results[ti];
    let ac_map = {};
    let result = {ac:[],links:[]};
    db.collection('filtered_flights_t_58c8f326-4814-4ad7-bfd7-0be4be933d2b').find({},(err, res)=>{
        for(let i=0; i< res.length; i++){
            let flight = res[i];
            let pos = utils.getPositionAtMoment(flight, network._id);
            if(pos)
            ac_map[flight._id] = pos 
        }
        for(let ac_1 in network.aircraft){
            if(ac_map[ac_1])
            result.ac.push(ac_map[ac_1])
            for(let i=0; i< network.aircraft[ac_1].length; i++){
                let ac_2 = network.aircraft[ac_1][i];
                if(ac_map[ac_1] && ac_map[ac_2])
                result.links.push({
                    start: ac_map[ac_1],
                    end: ac_map[ac_2]
                })
            }
        }
    fs.writeFile('./export/positionMap'+ti+'.json' , JSON.stringify(result), function (err) {
        console.log('P/0: '+ ti)
        callback();
    });



    })
})
}

var cb = ()=>{
    if(gti > 300){
        return
    }else{
        doit(++gti, cb)
    }
}

doit(gti, cb)