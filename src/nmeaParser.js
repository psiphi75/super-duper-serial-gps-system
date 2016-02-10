/*********************************************************************
 *                                                                   *
 *   Copyright 2016 Simon M. Werner                                  *
 *                                                                   *
 *   Licensed to the Apache Software Foundation (ASF) under one      *
 *   or more contributor license agreements.  See the NOTICE file    *
 *   distributed with this work for additional information           *
 *   regarding copyright ownership.  The ASF licenses this file      *
 *   to you under the Apache License, Version 2.0 (the               *
 *   "License"); you may not use this file except in compliance      *
 *   with the License.  You may obtain a copy of the License at      *
 *                                                                   *
 *      http://www.apache.org/licenses/LICENSE-2.0                   *
 *                                                                   *
 *   Unless required by applicable law or agreed to in writing,      *
 *   software distributed under the License is distributed on an     *
 *   "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY          *
 *   KIND, either express or implied.  See the License for the       *
 *   specific language governing permissions and limitations         *
 *   under the License.                                              *
 *                                                                   *
 *********************************************************************/

'use strict';

var requiredProperties = [
							'lat',
							'lon',
							'latPole',
							'lonPole',
							'alt',
							'numSat',
							'horDilution',
							'timestamp',
							'fixType'
						];

/**
 * Parse Nmea data - the fix type.
 * @param  {object} nmeaData the Nmea object.
 * @return {object}          The actuall lat/longs as a decimal degrees. If there
 *                           is a problem (Nmea objec tis not well defined), then
 *                           undefined is returned.  If the lat/lon values are
 *                           blank then undefined is also returned.
 */
function parseNmeaFix(nmeaData) {

	// Make sure all required properties exist in nmeaData
	for (var i = 0; i < requiredProperties.length; i += 1) {
		if (!nmeaData.hasOwnProperty(requiredProperties[i])) {
			return undefined;
		}
	}

	var latitude = parseLatLong(nmeaData, 'lat');
	var longitude = parseLatLong(nmeaData, 'lon');

	// No fix or error occurred
	if (latitude === undefined || longitude === undefined) {
		return undefined;
	}

    return {
        latitude: latitude,
        longitude: longitude,
        alt: nmeaData.alt,
        altUnit: nmeaData.altUnit,
        numSat: nmeaData.numSat,
        horDilution: nmeaData.horDilution,
        timestamp: nmeaData.timestamp,
		fixType: nmeaData.fixType
    };

}

/**
 * Helper function just to parse the lat/long values from strings.
 * @param  {object} nmeaData The nmea object returned by nmea module.
 * @param  {string} type     'lat' or 'lon'
 * @return {number}          lat or lon
 */
function parseLatLong (nmeaData, type) {

	var signStr = nmeaData[type + 'Pole'].toLowerCase();
	var sign = 1;
	if (signStr === 'w' || signStr === 's') {
		sign = -1;
	}

	var val = nmeaData[type];
	if (typeof val !== 'string' || val.length === 0) {
		return undefined;
	}
	var degrees = 0;
	var minutes = 0;
	var seconds = 0;

	var valArray = val.split('.');

	try {

		// Parse Seconds (Note: this is in decimal format (0..100) not seconds
		// format (0..60). So we dividing by 6000 instead of the usuall 3600).
		if (valArray.length === 2) {
			var secondStr = valArray[1];

			var secondInt = parseInt(secondStr.substring(0, 2));
			var secondFrac = parseInt(secondStr.substring(2));
			seconds = secondInt + secondFrac / 100;
		}

		// Parse minutes and seconds
		if (valArray.length >= 1) {

			var str = valArray[0];
			var startPos = str.length - 2;

			if (startPos <= 0) {
				degrees = parseInt(str);
			} else {
				degrees = parseInt(str.substring(0, startPos));
				minutes = parseInt(str.slice(-2));
			}

		}

	} catch (ex) {
		console.error(ex, val);
		return val;
	}

	return sign * (degrees + minutes / 60 + seconds / 6000);

}

module.exports = parseNmeaFix;
