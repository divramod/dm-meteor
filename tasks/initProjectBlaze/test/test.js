var should = require('chai').should();
var expect = require('chai').expect;
var colors = require("colors");
var path = require("path");

// =========== [ npm-module-name TESTS ] ===========
describe('initProjectBlaze async'.red, function() {

    // =========== [ start ] ===========
    it('success: should ...', function* success() {
        var projectDirectory = path.resolve(__dirname, "testproject");
        var result =
            yield require('./../index.js').start(projectDirectory);
        result.should.equal(projectDirectory);
    });

    // =========== [ start ] ===========
    it.skip('error: should ...', function* error() {
        var result =
            yield require('./../index.js').start();
        result.should.equal("falseinitProjectBlaze async'.Sync");
    });

});
