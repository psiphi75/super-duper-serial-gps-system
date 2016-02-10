//include the module
var serialgps = require('./src/serialgps.js');

//create a new instance. arguments are serial port and baud rate
var gps = new serialgps('/dev/ttyO2', 9600);

//monitor for data
gps.on('position', function(data) {
    if (!data) {
        console.log('No fix yet');
    } else {
        console.log(new Date().getTime(), data.latitude, data.longitude, data.alt);
    }
});
