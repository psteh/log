const fs = require('fs');
const moment = require('moment-timezone');

moment.tz.setDefault(); // set default timezone

const LOG_LEVEL = {
    OFF: 0,
    DEBUG: 1,
    INFO: 2,
    WARN: 3,
    ERROR: 4,
    FATAL: 5,
};

let PATH = './';
let FILENAME = 'log.log';
let LEVEL = 'DEBUG';
let SIZE = 50;
let TRANSACTION_ID_LENGTH = 10;
let LOG_TO_CONSOLE = true;
let WRITE_TO_FILE = true;
let FORMAT = 'YYYYMMDD HHmmss.SSS';
let TIMEZONE = 'UTC';
let FILE = `${PATH}/${FILENAME}`;

const init = ({
    path = PATH,
    filename = FILENAME,
    level = LEVEL,
    size = SIZE,
    transactionIdLength = TRANSACTION_ID_LENGTH,
    logToConsole = LOG_TO_CONSOLE,
    writeToFile = WRITE_TO_FILE,
    datetime: {
        format = FORMAT,
        timezone = TIMEZONE,
    }
}) => {
    PATH = path || PATH;
    FILENAME = filename || FILENAME;
    LEVEL = level || LEVEL;
    SIZE = size || SIZE;
    TRANSACTION_ID_LENGTH = transactionIdLength || TRANSACTION_ID_LENGTH;
    LOG_TO_CONSOLE = logToConsole || LOG_TO_CONSOLE;
    WRITE_TO_FILE = writeToFile || WRITE_TO_FILE;
    FORMAT = format || FORMAT;
    TIMEZONE = timezone || TIMEZONE;
    FILE = `${PATH}/${FILENAME}`;

    if (!fs.existsSync(PATH)) {
        fs.mkdirSync(PATH, { recursive: true });
    }

    if (!fs.existsSync(FILE)) {
        fs.appendFileSync(FILE, '');
    } else {
        doRollover();
    }
};

/*
 *  Do not log if config is set over log level or log level is OFF
 */
const checkLevel = (lvl) => {
    if (LOG_LEVEL[LEVEL] == 0) {
        return false;
    }
    return LOG_LEVEL[lvl.toUpperCase()] >= LOG_LEVEL[LEVEL.toUpperCase()];
};

/*
 *  Check file size in terms of MB
 */
const checkSize = () => {
    if (fs.statSync(FILE).size >= SIZE * 1024 * 1024) {
        doRollover();
    }
};

const doChecking = (type) => {
    if (!checkLevel(type)) {
        return;
    }
    checkSize();
};

/*
 *  Rollover on:-
 *  - over file size
 *  - new day
 */
const doRollover = () => {
    let exist = false;
    let counter = 1;
    while (!exist) {
        let filename = FILENAME.split('.');
        filename.splice(1, 0, moment().tz(TIMEZONE).format('YYYYMMDD'));
        filename.splice(2, 0, counter.toString());
        const newFilename = `${PATH}/${filename.join('.')}`;

        if (!fs.existsSync(newFilename)) {
            fs.renameSync(FILE, newFilename); // rename the current log file with rollover
            fs.appendFileSync(FILE, ''); // create new file with empty content
            exist = true;
        }

        counter++;
    }
};

const debug = (log) => logMessage('DEBUG', log);

const info = (log) => logMessage('INFO', log);

const warn = (log) => logMessage('WARN', log);

const error = (log) => logMessage('ERROR', log);

const fatal = (log) => logMessage('FATAL', log);

const logMessage = (type, log) => {
    doChecking(type);
    const message = typeof log === 'object' ? log.message : log;
    const transactionId = typeof log === 'object' ? log.transactionId : '';
    const obj = {
        timestamp: moment().tz(TIMEZONE).format(FORMAT),
        level: type.padStart(5, ' '),
        transactionId: (transactionId.length < TRANSACTION_ID_LENGTH) ? transactionId.padStart(TRANSACTION_ID_LENGTH, ' ') : transactionId.substr(0, TRANSACTION_ID_LENGTH),
        message,
    };
    write(obj);
}

const write = (obj) => {
    let message = '';
    for (const key in obj) {
        if (key == 'message' && (typeof obj[key] == 'object' || Array.isArray(obj[key]))) {
            obj[key] = JSON.stringify(obj[key]);
        }
        message += `${obj[key]} `;
    }
    if (LOG_TO_CONSOLE) {
        console.log(message);
    }
    if (WRITE_TO_FILE) {
        message += '\n';
        fs.appendFileSync(FILE, message);
    }
};

module.exports = {
    init,
    debug,
    info,
    warn,
    error,
    fatal
}