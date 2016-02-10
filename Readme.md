# super-duper-serial-gps-system

This JavaScript library makes use of the serial port and NMEA modules to simplify data collection from a GPS device.


## Serial NMEA GPS Module

This module makes use of the serialport and nmea modules to simplify data collection from a GPS device.

### Installation

```bash
npm install super-duper-serial-gps-system
```

### Usage

Simple usage can be found in main.js

```javascript
// include the module
var serialgps = require('super-duper-serial-gps-system');

// create a new instance. arguments are serial port and baud rate.
// You may have to change the baudrate to another value, read you
// GPS device documentation.
var gps = new serialgps('/dev/ttyO1', 4800);

// monitor for 'position' event.  The data object is described below.
gps.on('position', function(data) {
    console.log(data);
});
```

The `position` event triggers the callback.  The `data` object is as follows:

```javascript
{ latitude: 52.76405833333333,          // Where positive values are north
  longitude: -1.0248166666666667,       // Where positive values are east
  alt: 84.8,
  altUnit: 'M',
  numSat: 5,
  horDilution: 1.81,
  timestamp: '140554.123',
  fixType: 'fix' }
```


You may also listen for a specific NMEA message type, any of

- fix - GGA message
- geo-position - GGL message
- nav-info - RMC message
- track-info - VTG message
- active-satellites - GSA message
- satellite-list-partial - GSV message

For example,

```javascript
gps.on('fix', function(data) {
    console.log(data);
});
```

returns the following object.  Note that this is the default nmea output and the 'lat' and 'lon' values are unprocessed strings in degrees / minutes / seconds format.

```javascript
{ type: 'fix',
  timestamp: '140554.000',
  lat: '5245.5061',
  latPole: 'N',
  lon: '00114.8934',
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
  talker_id: 'GP' }
```

# Trouble Shooting

This section describes some tips for trouble shooting.

## Using your GPS device for the first time

When you first use a GPS device from the factory, it will take a long time to
determine the position.  This time is called time to first fix
(https://en.wikipedia.org/wiki/Time_to_first_fix), it can take up-to 15 minutes
to get the signal on first use.  If you have previously used the GPS it can take
around 20 seconds.

## Some GPS devices need to be powered on

Some GPS devices require the PWR (power) line to be set for a short period
(100ms) before they start working.  This is like the Origin Nano Hornet
(ORG1411), see also MikroE Nano GPS click.  This feature allows your GPS device
to be turned on and off, which saves power.



## License

Copyright 2016 Simon M. Werner

Licensed to the Apache Software Foundation (ASF) under one or more contributor license agreements.  See the NOTICE file distributed with this work for additional information regarding copyright ownership.  The ASF licenses this file to you under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.  You may obtain a copy of the License at

  [http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0)

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  See the License for the specific language governing permissions and limitations under the License.
