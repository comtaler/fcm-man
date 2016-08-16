'use strict';

const request = require('request');
const debug = require('debug')('node-fcm-group');

const Constants = require('./constants');

class Group {
    constructor(options) {
        this.options = options || {};
        if (!this.options.apiKey || !this.options.senderId)
            debug('missing apiKey or senderId');
    }

    headers() {
        return {
            Authorization: 'key=' + this.options.apiKey,
            project_id: this.options.senderId
        };
    }

    createDeviceGroup(name, ids, callback) {
        let payload = {
            operation: 'create',
            notification_key_name: name,
            registration_ids: ids || []
        };
        this._request(payload, callback);
    }

    addDeviceToGroup(name, key, ids, callback) {
        let payload = {
            operation: 'add',
            notification_key_name: name,
            notification_key: key,
            registration_ids: ids || []
        };
        this._request(payload, callback);
    }

    removeDeviceFromGroup(name, key, ids, callback) {
        let payload = {
            operation: 'remove',
            notification_key_name: name,
            notification_key: key,
            registration_ids: ids || []
        };
        this._request(payload, callback);
    }

    _request(payload, callback) {
        let requestOptions = {
            method: 'POST',
            headers: this.headers(),
            uri: Constants.FCM_NOTIFICATION_URI,
            json: payload
        };

        request(requestOptions, (err, res, jsonBody) => {
            if (err) return callback(err);
            if (res.statusCode >= 500) {
                debug('FCM service is unavailable');
                return callback(res.statusCode);
            }
            if (res.statusCode === 401) {
                debug('Unauthorized. Please check apiKey and senderId.');
                return callback(res.statusCode);
            }
            if (res.statusCode !== 200) {
                debug('Unexpected return (' + res.statusCode + '): ' + jsonBody);
                return callback(res.statusCode);
            }
            callback(null, jsonBody.notification_key);
        });
    }
}

module.exports = Group;
