- [Options](#options)
- [How To Use](#how-to-use)

# es-log

**Easy and Simple Logging** to use.

This package provides an easy and simple to use logging to your application.

```javascript
const log = require('@psteh/es-log');
 
log.init();
 
log.debug('Yep, this line here...');
log.info('Nothing to see here folks...');
log.warn('This line looks sus');
log.error('Line just got serious');
log.fatal('EMERGENCY MEETING!');
```

## Options

| Property            | Type    | Default               | Description                                                  |
| ------------------- | ------- | --------------------- | ------------------------------------------------------------ |
| path                | string  | ./                    | Path to log file                                             |
| filename            | string  | log.log               | File name                                                    |
| level               | string  | DEBUG                 | Log level<br />Accepts one of following level:<br />- DEBUG<br />- INFO<br />- WARN<br />- ERROR<br />- FATAL |
| size                | integer | 50                    | Maximum size of log (mb)                                     |
| transactionIdLength | integer | 10                    | Length of transactionId<br />**Note: transactionId will get truncate if ID provided is longer than set** |
| logToConsole        | boolean | true                  | Print log to console                                         |
| datetime            | object  | {}                    | Options for datetime (refer below)                           |
| datetime.format     | string  | YYYYMMDD HH:mm:ss.SSS | Datetime format                                              |
| datetime.timezone   | string  | UTC                   | Timezone for datetime                                        |

## How to use

```javascript
const log = require('@psteh/es-log');
 
log.init({
    path: './logs',
    filename: 'log.log',
    level: 'DEBUG',
    size: 50,
    transactionIdLength: 10,
    logToConsole: false,
    datetime: {
        format: 'YYYYMMDD HH:mm:ss.SSS',
        timezone: 'UTC'
    }
});
 
log.debug('Yep, this line here...');
log.info('Nothing to see here folks...');
log.warn('This line looks sus');
log.error('Line just got serious');
log.fatal('EMERGENCY MEETING!');

// prints
// [20200101 000123.360][          ] Yep, this line here
// [20200101 000123.369][          ] Nothing to see here folks...
// [20200101 000123.372][          ] This line looks sus
// [20200101 000123.376][          ] Line just got serious
// [20200101 000123.380][          ] EMERGENCY MEETING!
```

You can pass in `transactionId` to note the whole transaction of a process.

<u>Note</u>: `transactionId` takes in maximum length of 10 characters

```javascript
log.debug({ transactionId: 'AU2020', message: 'Yep, this line here...'});
log.info({ transactionId: 'AU2020', message: 'Nothing to see here folks...'});
log.warn({ transactionId: 'AU2020', message: 'This line looks sus'});
log.error({ transactionId: 'AU2020', message: 'Line just got serious'});
log.fatal({ transactionId: 'AU2020', message: 'EMERGENCY MEETING!'});

// prints
// [20200101 000123.360][AU2020    ] Yep, this line here
// [20200101 000123.369][AU2020    ] Nothing to see here folks...
// [20200101 000123.372][AU2020    ] This line looks sus
// [20200101 000123.376][AU2020    ] Line just got serious
// [20200101 000123.380][AU2020    ] EMERGENCY MEETING!
```

