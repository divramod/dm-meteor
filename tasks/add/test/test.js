var should = require('chai').should();
var expect = require('chai').expect;
var colors = require("colors");

// =========== [ dm-file TESTS ] ===========
describe('add sync'.red, function() {

    // =========== [ start ] ===========
    it('success: should ...', function success() {
        var result = require('./../index.js').start("add");
        result.should.equal("add");
    });

    // =========== [ start ] ===========
    it.skip('error: should ...', function error() {
        var result = require('./../index.js').start("add");
        result.should.equal("falseadd");
    });

});
