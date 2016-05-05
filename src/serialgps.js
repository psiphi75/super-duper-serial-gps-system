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

/*
 * This code is based on the following:
 *   https://github.com/omcaree/node-serialgps/blob/master/src/serialgps.js
 */

'use strict';

var serialport = require('serialport');
var nmea = require('nmea');
var EventEmitter = require('events').EventEmitter;
var parseNmeaFix = require('./nmeaParser');


var serialgps = function(device, baud) {
    var port = new serialport.SerialPort(device, {
                    baudrate: baud,
                    parser: serialport.parsers.readline('\n')
                });
    var self = this;
    port.on('data', function(line) {

        // nmea can throw errors if the serial data is corrupt.
        if (line === undefined) {
            return;
        }
        var data;
        try {
            data = nmea.parse(line);
        } catch (ex) {
            return;
        }
        if (data === undefined) {
            return;
        }

        // Emit our stuff
        self.emit('data', data);
        self.emit('raw', line);
        self.emit(data.type, data);
        if (data.type === 'fix') {
            self.emit('position', parseNmeaFix(data));
        }
    });
};

serialgps.prototype = new EventEmitter();

module.exports = serialgps;
