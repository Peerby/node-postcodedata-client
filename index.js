var _ = require('lodash');
var debug = require('debug')('postcodedata-client');
var needle = require('needle');
var util = require('util');
var validateIp = require('validate-ip');

var baseUrl = 'http://api.postcodedata.nl/v1/postcode/';
var defaultOptions = {
    type: 'json',
    timeout: 5 * 1000, //5 seconds
};

function Client (options) {
    this.options = _.extend({}, defaultOptions, _.pick(options, [
        'domain',
        'timeout',
        'type',
    ]));
}

Client.prototype.get = function get(postcode, streetNumber, userIp, done) {
    if (arguments.length < 4) {
        return done(new Error('expecting 4 arguments'));
    }
    if (!validatePostcode(postcode)) {
        return done(new Error('not a postcode'));
    }
    streetNumber = parseStreetNumber(streetNumber);
    if (!streetNumber) {
        return done(new Error('not a number'));
    }
    if (!validateIp(userIp)) {
        return done(new Error('no userip'));
    }

    var url = util.format(
        '%s?postcode=%s&streetnumber=%s&type=%s&userip=%s',
        baseUrl,
        postcode,
        streetNumber,
        this.options.type,
        userIp
    );
    if (this.options.domain) {
        url += '&ref='+this.options.domain;
    }

    var options = _.pick(this.options, ['timeout']);

    needle.get(url, options, function (err, res) {
        if (err || res.statusCode !== 200) {
            return done(new Error('unexpected error: ' + err));
        }
        if (res.body.status === 'error') {
            return done(new Error(res.body.errormessage));
        }
        done(null, res.body.details[0]);
    });
};

function validatePostcode(postcode) {
    var trim = postcode.replace(/\s+/g, ''); //remove spaces
    var postcodeRegex = /^\d{4} ?[a-z]{2}$/i; //match postcode of form 1234AB
    return postcodeRegex.test(trim);
}

function parseStreetNumber(streetNumber) {
    if (!streetNumber) {
        return false;
    }
    if (isInteger(streetNumber)) {
        return streetNumber;
    }
    var splitOnNonNumber = streetNumber.split(/([^0-9])/g); //matches non-numerical characters
    if (splitOnNonNumber.length > 1) {
        debug('streetNumber contains non-numerical characters, discarded everything from first occurence onwards');
    }
    return splitOnNonNumber[0];
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger
function isInteger(value) {
    return typeof value === "number" &&
           isFinite(value) &&
           Math.floor(value) === value;
}

module.exports = function createClient(options) {
    return new Client(options);
};
