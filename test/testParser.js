var test = require('tape');
var parseNmeaFix = require('../src/nmeaParser');


/**
 * Round a number to the given number of decimal places.
 * @param  {number} num The number to round
 * @param  {number} dp  decimal places (integer)
 * @return {number}     The rounded number
 */
function roundDp(num, dp) {
    var mul = Math.pow(10, dp);
    return Math.round(num * mul) / mul;
}


test('GPS Coord - parse lat/long', function (t) {

    var gpsGood = {
        type: 'fix',
        timestamp: '140554.123',
        lat: '5245.5061',
        latPole: 'N',
        lon: '00100.8934',
        lonPole: 'W',
        fixType: 'fix',
        numSat: 5,
        horDilution: 1.81,
        alt: 84.8,
        altUnit: 'M',
        geoidalSep: 47.5,
        geoidalSepUnit: 'M',
        differentialAge: 0,
        differentialRefStn: '',
        talker_id: 'GP'
    };
    var result = parseNmeaFix(gpsGood);

    t.equal(roundDp(result.latitude, 5), roundDp(52 + 45 / 60 + 50.61 / 6000, 5));
    t.equal(roundDp(result.longitude, 5), roundDp(-(1 + 0 / 60 + 89.34 / 6000), 5));
    t.end();

});


test('GPS Coord - parse empty result', function (t) {

    var gpsEmpty = {
        sentence: 'GGA',
        type: 'fix',
        timestamp: '',
        lat: '',
        latPole: '',
        lon: '',
        lonPole: '',
        fixType: 'none',
        numSat: 0,
        horDilution: 0,
        alt: 0,
        altUnit: 'M',
        geoidalSep: 0,
        geoidalSepUnit: 'M',
        differentialAge: 0,
        differentialRefStn: '0000',
        talker_id: 'GP'
    };

    var result = parseNmeaFix(gpsEmpty, 'lat');

    t.equal(result, undefined);
    t.end();

});

test('GPS Coord - parse rubbish', function (t) {

    var result = parseNmeaFix({});

    t.equal(result, undefined);
    t.end();

});
