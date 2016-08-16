"use strict";

const should = require('should');
const sinon = require('sinon');
const proxyquire = require('proxyquire');
const Constants = require('../../lib/constants');

describe('Group', function () {
    let args = {};
    let setArgs = (err, res, resBody) => {
        args = {
            err: err,
            res: res,
            resBody: resBody
        };
    };
    let requestStub = (options, callback) => {
        args.options = options;
        return callback(args.err, args.res, args.resBody);
    };
    const Group = proxyquire('../../lib/group', {'request': requestStub});
    const defaultOptions = {
        apiKey: 'testApiKey',
        senderId: 'testSenderId'
    };

    describe('constructor', function () {
        it('should create a Sender with options passed in', function () {
            let options = defaultOptions;
            let group = new Group(options);
            group.should.be.instanceOf(Group);
            group.options.should.deepEqual(options);
        });

        it('should accept invalid apiKey', function () {
            let options = {senderId: 'testSenderId'};
            let group = new Group(options);
            group.should.be.instanceOf(Group);
            group.options.should.deepEqual(options);
        });

        it('should accept invalid senderId', function () {
            let options = {apiKey: 'testApiKey'};
            let group = new Group(options);
            group.should.be.instanceOf(Group);
            group.options.should.deepEqual(options);
        });

        it('should accept no options', function () {
            let group = new Group();
            group.should.be.instanceOf(Group);
            group.options.should.deepEqual({});
        });
    });

    describe('headers()', function() {
        it('should return proper authorization headers', function() {
            let options = defaultOptions;
            let group = new Group(options);
            group.headers().should.deepEqual({
                Authorization: 'key='+options.apiKey,
                project_id: options.senderId
            });
        });
    });

    describe('createDeviceGroup()', function() {
        it('should construct proper payload', function() {
            let group = new Group(defaultOptions);
            setArgs(null, {statusCode: 200}, {notification_key: 'returnKey'});
            group.createDeviceGroup('myName', ['myKey'], (err, notificationKey) => {
                args.options.should.deepEqual({
                    method: 'POST',
                    headers: group.headers(),
                    uri: Constants.FCM_NOTIFICATION_URI,
                    json: {
                        operation: 'create',
                        notification_key_name: 'myName',
                        registration_ids: ['myKey']
                    }
                });
                notificationKey.should.equal('returnKey');
            });
        });

        it('should return error 500 if request returns 500', function() {
            let group = new Group(defaultOptions);
            setArgs(null, {statusCode: 500}, {});
            group.createDeviceGroup('myName', ['myKey'], (err) => {
                err.should.equal(500);
            });
        });

        it('should return error 401 if request returns 500', function() {
            let group = new Group(defaultOptions);
            setArgs(null, {statusCode: 401}, {});
            group.createDeviceGroup('myName', ['myKey'], (err) => {
                err.should.equal(401);
            });
        });

        it('should return error code if request returns none-200', function() {
            let group = new Group(defaultOptions);
            setArgs(null, {statusCode: 404}, {});
            group.createDeviceGroup('myName', ['myKey'], (err) => {
                err.should.equal(404);
            });
        });

        it('should return error if request returns error', function() {
            let group = new Group(defaultOptions);
            setArgs('error', {}, {});
            group.createDeviceGroup('myName', ['myKey'], (err) => {
                err.should.equal('error');
            });
        });

        it('should accept null ids', function() {
            let group = new Group(defaultOptions);
            setArgs(null, {statusCode: 200}, {notification_key: 'returnKey'});
            group.createDeviceGroup('myName', null, (err, notificationKey) => {
                args.options.json.registration_ids.should.deepEqual([]);
            });
        });
    });

    describe('addDeviceToGroup()', function() {
        it('should construct proper payload', function () {
            let group = new Group(defaultOptions);
            setArgs(null, {statusCode: 200}, {notification_key: 'myKey'});
            group.addDeviceToGroup('myName', 'myKey', ['myKey'], (err, notificationKey) => {
                args.options.should.deepEqual({
                    method: 'POST',
                    headers: group.headers(),
                    uri: Constants.FCM_NOTIFICATION_URI,
                    json: {
                        operation: 'add',
                        notification_key_name: 'myName',
                        notification_key: 'myKey',
                        registration_ids: ['myKey']
                    }
                });
                notificationKey.should.equal('myKey');
            });
        });

        it('should accept null ids', function() {
            let group = new Group(defaultOptions);
            setArgs(null, {statusCode: 200}, {notification_key: 'returnKey'});
            group.addDeviceToGroup('myName', 'myKey', null, (err, notificationKey) => {
                args.options.json.registration_ids.should.deepEqual([]);
            });
        });
    });

    describe('removeDeviceFromGroup()', function() {
        it('should construct proper payload', function () {
            let group = new Group(defaultOptions);
            setArgs(null, {statusCode: 200}, {notification_key: 'myKey'});
            group.removeDeviceFromGroup('myName', 'myKey', ['myKey'], (err, notificationKey) => {
                args.options.should.deepEqual({
                    method: 'POST',
                    headers: group.headers(),
                    uri: Constants.FCM_NOTIFICATION_URI,
                    json: {
                        operation: 'remove',
                        notification_key_name: 'myName',
                        notification_key: 'myKey',
                        registration_ids: ['myKey']
                    }
                });
                notificationKey.should.equal('myKey');
            });
        });

        it('should accept null ids', function() {
            let group = new Group(defaultOptions);
            setArgs(null, {statusCode: 200}, {notification_key: 'returnKey'});
            group.removeDeviceFromGroup('myName', 'myKey', null, (err, notificationKey) => {
                args.options.json.registration_ids.should.deepEqual([]);
            });
        });
    });
});
