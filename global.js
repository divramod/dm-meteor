var colors = require("colors");
var co = require("co");
require("shelljs/global");
var jobs = {};
var result = {};
var module_path = __dirname;

// =========== [ job.index() ] ===========
jobs.index = co.wrap(function*() {
    try {

        // =========== [ get params from user input ] ===========
        var argv2 = process.env.dmnJob || process.argv[2] || "help";

        // =========== [ help ] ===========
        if (["help", "-help", "h", "-h"].indexOf(argv2) > -1) {
            var task = require("./tasks/help/index.js");
            yield task.start(module_path);
        }
        // =========== [ test ] ===========
        else if (["test", "-test", "t", "-t"].indexOf(argv2) > -1) {
            var task = require("./tasks/test/index.js");
            yield task.start();
        }
        // =========== [ todo ] ===========
        else if (["todo"].indexOf(argv2) > -1) {
            require("dm-npm").todo(__dirname);
        }
        // =========== [ idea ] ===========
        else if (["idea"].indexOf(argv2) > -1) {
            require("dm-npm").idea(__dirname);
        }
        // =========== [ prompt ] ===========
        else if (["prompt","p"].indexOf(argv2) > -1) {
            require("dm-npm").prompt(__dirname);
        }
        // =========== [ test ] ===========
        else if (["config", "-config"].indexOf(argv2) > -1) {
            var task = require("./tasks/config/index.js");
            yield task.start();
        }
        // =========== [ test ] ===========
        else if (["createKey", "key"].indexOf(argv2) > -1) {
            var task = require("./tasks/createKey/index.js");
            yield task.start();
        }
        // =========== [ test ] ===========
        else if (["buildApp", "build"].indexOf(argv2) > -1) {
            var task = require("./tasks/buildApp/index.js");
            yield task.start();
        }

        // automatically add tasks here

        // =========== [ cli ] ===========
        else if (['cli','c'].indexOf(argv2) > -1) {
            var task = require("./tasks/cli/index.js");
            yield task.start();
        }

        // =========== [ help ] ===========
        else {
            var task = require("./tasks/help/index.js");
            yield task.start(module_path);
        }

    } catch (e) {
        console.log("Filename: ", __filename, "\n", e.stack);
    }

    return Promise.resolve(result);
}); // job.index()

// =========== [ MODULE EXPORT ] ===========
module.exports = jobs;
