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

db.collection("network-"+collectionUuid).find((err, res) => {
    for(let i=1; i< res.length; i++){
        for(let ac in res[i].aircraft){
            for(let j=0; j< res[i].aircraft[ac].length; j++){
                let linkHash = hash([ac, res[i].aircraft[ac][j]].join(''))
                //console.log([ac, res[i].aircraft[ac][j]])
                console.log(linkHash)
                if(links[linkHash]){
                    links[linkHash].duration +=deltaT;
                    links[linkHash].ts.push(res[i]._id);
                }else{
                    links[linkHash] = {
                        hash: linkHash,
                        duration: deltaT,
                        end: res[i].aircraft[ac][j],
                        start: ac,
                        ts:[res[i]._id]
                    }
                }
                //console.log(++c)
            }
        }
    }
    for(let key in links){
        linkArray.push(links[key])
    }
    //for(let k=0; k< linkArray.length; k++){
        handleLink(linkArray[doneCount], linkCallback)
    //}
})

var doneCount =0;
var finalLinkResults = [];

function linkCallback(linkObj){
    linkObj._id = linkObj.hash;
    db.collection('linkExport_'+collectionUuid).insert({linkObj}, (err, res)=>{
            
        doneCount++;
        console.log('Done: ' + doneCount + ' of ' + linkArray.length);
        if(doneCount == linkArray.length){
            console.log('Fertig')
            // fs.writeFile('./export/linkDetails_004.json' , JSON.stringify(finalLinkResults), function (err) {
            //     if(err)
            //     console.log(err)
            //     console.log('Passout')
            // });
        }else{
            handleLink(linkArray[doneCount], linkCallback)
        }

    });
}


function handleLink(link, callback){
    let linkObj = Object.assign({}, link, {startArr:[],endArr:[]});
    db.collection('filtered_flights_'+ collectionUuid).find({_id:link.start}, (err,f1res) =>{
        if(!f1res){
            callback(linkObj);
            return;
        }
        let f1 = f1res[0];
        
        db.collection('filtered_flights_'+ collectionUuid).find({_id:link.end}, (err,f2res) =>{
            if(!f2res){
                callback(linkObj);
                return;
            }
            let f2 = f2res[0];
            for(let i=0; i< link.ts.length; i++){
                let f1pos = utils.getPositionAtMoment(f1,link.ts[i])
                let f2pos = utils.getPositionAtMoment(f2,link.ts[i])
                linkObj.startArr.push(f1pos);
                linkObj.endArr.push(f2pos);
            }
            callback(linkObj);
        });
    })
}

