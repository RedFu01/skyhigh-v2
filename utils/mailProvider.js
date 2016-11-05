var sendgrid  = require('sendgrid')('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');

function notify(title, text, mail){
    sendgrid.send({
        from: 'bot@smartpanel.de',
        fromname:'BroBot',
        to: mail || 'konradfuger@googlemail.com',
        subject:title,
        text:text
    }, function(err, json) {
        if (err) {console.log(err)}
});
    
}

module.exports = {
  notify:notify
}
