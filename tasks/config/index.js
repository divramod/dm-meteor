// =========== [ REQUIRE ] ===========
var co = require("co");
var dmNpm = require("dm-npm");

// =========== [ MODULE DEFINE ] ===========
var job = {};

// =========== [ job.start() ] ===========
job.start = co.wrap(function*() {
    try {
        console.log("start config");
        dmNpm.addConfigFile("~/.dm-meteor.json", "{\n}");
    } catch (e) {
        console.log("Filename: ", __filename, "\n", e.stack);
    }
    return yield Promise.resolve();
}); // job.start()

// =========== [ MODULE EXPORT ] ===========
module.exports = job;
