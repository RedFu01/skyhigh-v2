var handleOrder = require('../compute/handleOrder')
console.log(process.argv);
var file = process.argv[2];
var fs = require('fs')

fs.readFile(file, "utf8", function (err, data) {
        if (err){
            console.log(err)
            return;
        }
        var order = JSON.parse(data);
        handleOrder(order, ()=>{
            console.log('Fertig');
        })

});



