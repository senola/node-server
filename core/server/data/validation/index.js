const schema = require('../schema').tables,
    _ = require('lodash'),
    validator = require('validator'),
    moment = require('moment-timezone'),
    assert = require('assert'),
    Promise = require('bluebird'),
    errors = require('../../errors'),
    logger = require('../../utils/logger'),
    settingsCache = require('../../settings/cache'),
    utils = require('../../utils/url');

/**
 *
 * @param input
 */
function assertString(input) {
    assert(typeof input === 'string', 'Validator js validates strings only');
}

/**
 * Counts repeated characters in a string. When 50% or more characters are the same,
 * we return false and therefore invalidate the string.
 * @param {String} stringToTest The password string to check.
 * @return {Boolean}
 */
function characterOccurance(stringToTest) {
    let chars = {},
        allowedOccurancy,
        valid = true;

    stringToTest = _.toString(stringToTest);
    allowedOccurancy = stringToTest.length / 2;

    // Loop through string and accumulate character counts
    _.each(stringToTest, char=> {
        if (!chars[char]) {
            chars[char] = 1;
        } else {
            chars[char] += 1;
        }
    });

    // check if any of the accumulated chars exceed the allowed occurancy
    // of 50% of the words' length.
    _.forIn(chars, charCount=> {
        if (charCount >= allowedOccurancy) {
            valid = false;
        }
    });

    return valid;
}

// extends has been removed in validator >= 5.0.0, need to monkey-patch it back in
validator.extend = function(name, fn) {
    validator[name] = function() {
        const args = Array.prototype.slice.call(arguments);

        assertString(args[0]);
        return fn.apply(validator, args);
    };
};

// Provide a few custom validators
validator.extend('empty', str=> {
    return _.isEmpty(str);
});

validator.extend('notContains', (str, badString)=> {
    return !_.includes(str, badString);
});

validator.extend('isTimezone', str=> {
    return !!moment.tz.zone(str);
});

validator.extend('isEmptyOrURL', str=> {
    return _.isEmpty(str) || validator.isURL(str, {require_protocol: false});
});

validator.extend('isSlug', str=> {
    return validator.matches(str, /^[a-z0-9\-_]+$/);
});


// Validation against schema attributes
// values are checked against the validation objects from schema.js
const validateSchema = function validateSchema(tableName, model) {
    let columns = _.keys(schema[tableName]),
        validationErrors = [];

    _.each(columns, columnKey=> {
        let message = '';
        const strVal = _.toString(model[columnKey]);

        // check nullable
        if (model.hasOwnProperty(columnKey) && schema[tableName][columnKey].hasOwnProperty('nullable')
            && schema[tableName][columnKey].nullable !== true) {
            if (validator.empty(strVal)) {
                message = 'notices.data.validation.index.valueCannotBeBlank' + JSON.stringify({tableName: tableName,
                    columnKey: columnKey});
                // validationErrors.push(new errors.ValidationError({message: message,
                //     context: tableName + '.' + columnKey}));
                logger.error(message);
            }
        }

        // validate boolean columns
        if (model.hasOwnProperty(columnKey) && schema[tableName][columnKey].hasOwnProperty('type')
            && schema[tableName][columnKey].type === 'bool') {
            if (!(validator.isBoolean(strVal) || validator.empty(strVal))) {
                message = 'notices.data.validation.index.valueMustBeBoolean' +  JSON.stringify({tableName: tableName,
                    columnKey: columnKey});
                // validationErrors.push(new errors.ValidationError({message: message,
                //     context: tableName + '.' + columnKey}));
                logger.error(message);
            }
        }

        // TODO: check if mandatory values should be enforced
        if (model[columnKey] !== null && model[columnKey] !== undefined) {
            // check length
            if (schema[tableName][columnKey].hasOwnProperty('maxlength')) {
                if (!validator.isLength(strVal, 0, schema[tableName][columnKey].maxlength)) {
                    message = 'notices.data.validation.index.valueExceedsMaxLength' +
                        JSON.stringify({
                            tableName: tableName,
                            columnKey: columnKey,
                            maxlength: schema[tableName][columnKey].maxlength
                        });
                    // // validationErrors.push(new errors.ValidationError({
                    // //     message: message,
                    // //     context: tableName + '.' + columnKey
                    // // }));
                    logger.error(message);
                }
            }

            // check validations objects
            if (schema[tableName][columnKey].hasOwnProperty('validations')) {
                validationErrors = validationErrors.concat(validate(strVal, columnKey, schema[tableName][columnKey].validations));
            }

            // check type
            if (schema[tableName][columnKey].hasOwnProperty('type')) {
                if (schema[tableName][columnKey].type === 'integer' && !validator.isInt(strVal)) {
                    message = 'notices.data.validation.index.valueIsNotInteger' + JSON.stringify({
                        tableName: tableName,
                        columnKey: columnKey
                    });
                    // validationErrors.push(new errors.ValidationError({
                    //     message: message,
                    //     context: tableName + '.' + columnKey
                    // }));
                    logger.error(message);
                }
            }
        }
    });

    if (validationErrors.length !== 0) {
        return Promise.reject(validationErrors);
    }

    return Promise.resolve();
};

// Validate default settings using the validator module.
// Each validation's key is a method name and its value is an array of options
//
// eg:
//      validations: { isURL: true, isLength: [20, 40] }
//
// will validate that a setting's length is a URL between 20 and 40 chars.
//
// If you pass a boolean as the value, it will specify the "good" result. By default
// the "good" result is assumed to be true.
//
// eg:
//      validations: { isNull: false }  // means the "good" result would
//                                      // fail the `isNull` check, so
//                                      // not null.
//
// available validators: https://github.com/chriso/validator.js#validators
const validate = function validate(value, key, validations) {
    const validationErrors = [];

    value = _.toString(value);

    _.each(validations, (validationOptions, validationName)=> {
        let goodResult = true;

        if (_.isBoolean(validationOptions)) {
            goodResult = validationOptions;
            validationOptions = [];
        } else if (!_.isArray(validationOptions)) {
            validationOptions = [validationOptions];
        }

        validationOptions.unshift(value);

        // equivalent of validator.isSomething(option1, option2)
        if (validator[validationName](...validationOptions) !== goodResult) {
            // validationErrors.push(new errors.ValidationError({
            //     message: i18n.t('notices.data.validation.index.validationFailed', {validationName: validationName,
            //         key: key})
            // }));
            logger.error('notices.data.validation.index.validationFailed');
        }

        validationOptions.shift();
    }, this);

    return validationErrors;
};
// Validation for settings
// settings are checked against the validation objects
// form default-settings.json
const validateSettings = function validateSettings(defaultSettings, model) {
    let values = model.toJSON(),
        validationErrors = [],
        matchingDefault = defaultSettings[values.key];

    if (matchingDefault && matchingDefault.validations) {
        validationErrors = validationErrors.concat(validate(values.value, values.key, matchingDefault.validations));
    }

    if (validationErrors.length !== 0) {
        return Promise.reject(validationErrors);
    }

    return Promise.resolve();
};



module.exports = {
    validate: validate,
    validator: validator,
    validateSchema: validateSchema,
    validateSettings: validateSettings
};
