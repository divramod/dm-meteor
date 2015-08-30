// =========== [ REQUIRE ] ===========
var co = require("co");
var dmPrompt = require("dm-prompt").Inquirer;
var dmPath = require("dm-path");
var colors = require("colors");
require("shelljs/global");

// =========== [ MODULE DEFINE ] ===========
var job = {};

// =========== [ job.start() ] ===========
job.start = co.wrap(function*(keyname, keypath) {
    try {
        var keyname = keyname || process.argv[3] || undefined;
        var keypath = keypath || process.argv[4] || undefined;

        // =========== [ proof if keyname is passed ] ===========
        if (!keyname) {
            var keynameAnswer =
                yield dmPrompt({
                    type: "input",
                    name: "keyname",
                    message: "You didn't passed a keyname. Whats your keyname?"
                });
            keyname = keynameAnswer.keyname;
            console.log(keyname);
        }

        // =========== [ create keypath ] ===========
        if (!keypath) {
            // ask for path
            var pathAnswer =
                yield dmPrompt({
                    type: "input",
                    name: "path",
                    message: "Where do you want to store the key? [default: ~/.keystore directory]"
                });
            var keyPath = pathAnswer.path;
        }
        if (keyPath === "") {
            keyPath = env['home'] + '/.keystore/' + keyname;
        } else {
            keyPath = dmPath.replace(keyPath);
        }
        var keyPath = '/home/mod/.keystore/' + keyname;

        // =========== [ proof if key exists ] ===========
        if (test("-f", keyPath)) {
            var message = 'The key ' + keyPath.red + ' already exists!';
            console.log(message);
        } else {

            // =========== [ create key ] ===========
            var command = 'keytool -genkey -alias ' + keyname + ' -keyalg RSA -keysize 2048 -validity 10000 -keystore ' + keyPath;
            var spawn = require('child_process').spawn;
            function shspawn(command) {
                spawn('sh', ['-c', command], {
                    stdio: 'inherit'
                });
            }
            shspawn(command);
        }
    } catch (e) {
        console.log("Filename: ", __filename, "\n", e.stack);
    }
    return yield Promise.resolve();
}); // job.start()

// =========== [ MODULE EXPORT ] ===========
module.exports = job;
