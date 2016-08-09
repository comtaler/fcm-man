"use strict";

const should = require('should');
const sinon = require('sinon');
const proxyquire = require('proxyquire');
const Constants = require('../../lib/constants');

describe('Group', function () {
    var args = {};
    var requestStub = function (options, callback) {
        args.options = options;
        return callback(args.err, args.res, args.resBody);
    };
    var Group = proxyquire('../../lib/group', {'request': requestStub});

    describe('constructor', function () {
        it('should create a Sender with options passed in', function () {
            let options = {
                apiKey: "testApiKey",
                senderId: "testSenderId"
            };
            let group = new Group(options);
            group.should.be.instanceOf(Group);
            group.options.should.deepEqual(options);
        });
    });
});
