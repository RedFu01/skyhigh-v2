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

let c =0;
let deltaT = 100;

db.collection("network-t_7387097f-4b7c-4c3e-b4a5-6fad3c7b4d14").find((err, res) => {
    for(let i=1; i< res.length; i++){
        for(let ac in res[i].aircraft){
            for(let j=0; j< res[i].aircraft[ac].length; j++){
                let linkHash = hash([ac, res[i].aircraft[ac][j]].join(''))
                //console.log([ac, res[i].aircraft[ac][j]])
                //console.log(linkHash)
                if(links[linkHash]){
                    links[linkHash].duration +=deltaT;
                }else{
                    links[linkHash] = {
                        duration: deltaT,
                        end: res[i].aircraft[ac][j],
                        start: ac
                    }
                }
                console.log(++c)
            }
        }
    }
    let linkArray = []
    for(let key in links){
        linkArray.push(links[key])
    }
    fs.writeFile('./export/links_500nmi.json' , JSON.stringify(linkArray), function (err) {
        if(err)
        console.log(err)
        console.log('Passout')
    });
})

