// =========== [ REQUIRE ] ===========
var co = require("co");
var dmPrompt = require("dm-prompt").Inquirer;
var dmPath = require("dm-path");
var colors = require("colors");
var spawn = require("dm-shell").spawn;
require("shelljs/global");

// =========== [ MODULE DEFINE ] ===========
var job = {};

// =========== [ job.start() ] ===========
job.start = co.wrap(function*(keyName, keyPath) {
    try {
        var keyName = keyName || process.argv[3] || undefined;
        var keyPath = keyPath || process.argv[4] || undefined;

        // =========== [ proof if keyName is passed ] ===========
        if (!keyName) {
            var keyNameAnswer =
                yield dmPrompt({
                    type: "input",
                    name: "keyName",
                    message: "You didn't passed a keyName. Whats your keyName?"
                });
            keyName = keyNameAnswer.keyName;
            console.log(keyName);
        }

        // =========== [ create keyPath ] ===========
        if (!keyPath) {
            // ask for path
            var pathAnswer =
                yield dmPrompt({
                    type: "input",
                    name: "path",
                    message: "Where do you want to store the key? [default: ~/.keystore directory]"
                });
            var keyPath = pathAnswer.path;
            if (keyPath === "") {
                keyPath = env['home'] + '/.keystore/' + keyName;
            }
        } else {
            keyPath = dmPath.replace(keyPath);
        }

        var createKey = true;
        // =========== [ proof if key exists ] ===========
        if (test("-f", keyPath)) {
            createKey = false;
            var message = 'The key ' + keyPath.red + ' already exists!';
            console.log(message);
            var overwriteAnswer =
                yield dmPrompt({
                    type: "input",
                    name: "overwrite",
                    message: "Do you want to overwrite the [Yes]?"
                });
            var overwrite = overwriteAnswer.overwrite;
            if (overwrite === "Yes") {
                createKey = true;
                var command = "rm " + keyPath;
                spawn(keyPath);
            }
        }

        if (createKey === true) {
            // =========== [ create key ] ===========
            var command = 'keytool -genkey -alias ' + keyName + ' -keyalg RSA -keysize 2048 -validity 10000 -keystore ' + keyPath;

            spawn(command);
        }
    } catch (e) {
        console.log("Filename: ", __filename, "\n", e.stack);
    }
    return yield Promise.resolve();
}); // job.start()

// =========== [ MODULE EXPORT ] ===========
module.exports = job;
