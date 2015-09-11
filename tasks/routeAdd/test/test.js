var should = require('chai').should();
var expect = require('chai').expect;
var colors = require("colors");
var path = require("path");

// =========== [ dm-file TESTS ] ===========
describe('routeAdd sync'.red, function() {

    // =========== [ start ] ===========
    it('success: should create the route', function success() {
        var testProjectPath = path.resolve(__dirname, "testProject");
        var result = require('./../index.js').start(testProjectPath);
        result.should.equal("route created");
    });

    // =========== [ start ] ===========
    it('error: should send a error message', function error() {
        var testProjectPath = path.resolve(__dirname, "testProjectFalse");
        var result = require('./../index.js').start(testProjectPath);
        result.message.should.equal("creation aborted no client/views/routes directory");
    });

});
