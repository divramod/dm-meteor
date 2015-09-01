
var co = require("co");
var jobs = {};

// =========== [ job.index() ] ===========
jobs.index = co.wrap(function*() {
    try {

        // =========== [ get params from user input ] ===========
        var argv2 = process.env.dmnJob || process.argv[2] || "help";

        // =========== [ test ] ===========
        if (["test", "-test", "t", "-t"].indexOf(argv2) > -1) {
            var task = require("./tasks/test/index.js");
            yield task.start();
        }

        // automatically add tasks here

        // =========== [ createKey ] ===========
        else if (["createKey", "key"].indexOf(argv2) > -1) {
            var task = require("./tasks/createKey/index.js");
            yield task.start();
        }
        // =========== [ buildApp ] ===========
        else if (["buildApp", "build"].indexOf(argv2) > -1) {
            var task = require("./tasks/buildApp/index.js");
            yield task.start();
        }

        // =========== [ cli ] ===========
        else if (['cli','c'].indexOf(argv2) > -1) {
            var task = require("./tasks/cli/index.js");
            yield task.start();
        }

        // =========== [ help ] ===========
        else {
            require("dm-npm").getCommonTasks(argv2, __dirname);
        }

    } catch (e) {
        console.log("Filename: ", __filename, "\n", e.stack);
    }

    return Promise.resolve();
}); // job.index()


// =========== [ MODULE EXPORT ] ===========
module.exports = jobs;
