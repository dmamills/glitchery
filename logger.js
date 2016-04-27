var winston = require('winston');
var moment = require('moment');


module.exports = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({
            timestamp: function() {
                return moment().format('MM/DD/YYYY hh:mm:ss a');
            },
            formatter: function(options) {
                return '[' + options.timestamp() + '] ' + options.level.toUpperCase() + ': ' + (options.message ? options.message : '');
            }
        }) 
    ]

});
