// =========== [ REQUIRE ] ===========
var co = require("co");
var colors = require("colors");
var dmPrompt = require("dm-prompt").Inquirer;

// =========== [ MODULE DEFINE ] ===========
var task = {};

// =========== [ task.start() ] ===========
task.start = co.wrap(function*(p1) {
    var p1 = p1 || process.argv[3] || undefined;
    try {
        console.log("start cli");
        yield run();

    } catch (e) {
        console.log("Filename: ", __filename, "\n", e.stack);
    }
    return yield Promise.resolve();
}); // task.start()

// =========== [ var run ] ===========
// TODO
var run = co.wrap(function*() {
    var cliAnswer =
        yield dmPrompt({
            type: "list",
            name: "cli",
            message: "What will you do?",
            choices: [
                "quit".green,
                "meteor run android-device ",
                "meteor",
                "meteor list",
                "meteor deploy"
            ]
        });
    var cli = cliAnswer.cli;
    if (cli !== "quit".green) {
        if (cli === "meteor deploy") {
            var serverAnswer =
                yield dmPrompt({
                    type: "input",
                    name: "server",
                    message: "Deploy to which server?"
                });
            var server = serverAnswer.server;
            var command = cli + " " + server;
        } else {
            var command = cli;
        }

        process.stdout.write('\033c');
        console.log("run " + command.green);
        // =========== [ run ] ===========
        var spawn = require('child_process').spawnSync;
        var myProcess = spawn('sh', ['-c', command], {
            stdio: 'inherit'
        });
        run();
    }
    return yield Promise.resolve();
}); // var run

// =========== [ MODULE EXPORT ] ===========
module.exports = task;
