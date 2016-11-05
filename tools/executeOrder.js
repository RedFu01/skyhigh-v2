var handleOrder = require('../compute/handleOrder');
var file = process.argv[2];
var fs = require('fs');
var mail = require('../utils/mailProvider');

fs.readFile(file, "utf8", function (err, data) {
        if (err){
            console.log(err)
            return;
        }
        var order = JSON.parse(data);
        handleOrder(order, (error)=>{
            if(error){
                mail.notify('Order error', error, order.email);
            }else{
                mail.notify('Order executed', 'Your order finished', order.email);
            }
            console.log('Fertig');
        })

});



