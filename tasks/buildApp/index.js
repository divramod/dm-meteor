// =========== [ REQUIRE ] ===========
var co = require("co");
var colors = require("colors");
var fs = require("fs");
var dmPrompt = require("dm-prompt").Inquirer;
var dmPath = require("dm-path");
var dmNpm = require("dm-npm");
var dmGit = require("dm-git");
var path = require("path");
require('shelljs/global');

// =========== [ MODULE DEFINE ] ===========
var job = {};

// =========== [ job.start() ] ===========
job.start = co.wrap(function*() {
    try {
        console.log("start buildApp");

        //aks for target server name, default  mobile-config.js App.info server
        if (test('-f', 'config.json')) {
            var config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
            //console.log(config);
        } else {
            var config = undefined;
            var message = "No config.json present!";
            console.log(message.red);
        }

        // ask for build destination, default ?
        var build = true;
        if (config.buildDestination) {
            var destination = path.resolve(pwd(), config.buildDestination);
            var message = "config.buildDestination (" + destination.green + ") will be used for build!";
            console.log(message);
        } else {
            var destinationAnswer =
                yield dmPrompt({
                    type: "input",
                    name: "destination",
                    message: "Where should the build be placed? [default: ../app_build]"
                });
            var destination = destinationAnswer.destination;
            if (destination === "") {
                var destination = path.join(pwd(), "..", "app_build");
                if (test("-d", destination)) {
                    var message = "Path " + destination.red + " existent! Should it be overwritten? [y]";
                    var createAnswer =
                        yield dmPrompt({
                            type: "input",
                            name: "create",
                            message: message
                        });
                    var create = createAnswer.create;
                    if (create !== "y") {
                        build = false;
                    }
                }
            } else {
                var destination = dmPath.replace(destination);
                if (!test("-d", destination)) {
                    var message = "Path " + destination.red + " not existent! Should it be created? [y]";
                    var createAnswer =
                        yield dmPrompt({
                            type: "input",
                            name: "create",
                            message: message
                        });
                    var create = createAnswer.create;
                    if (create !== "y") {
                        console.log(create);
                        build = false;
                    }
                }

            }
        }

        // =========== [ build process ] ===========
        if (build) {
            console.log(destination);

            // =========== [ commit open changes ] ===========
            yield dmGit.commit(true);

            // =========== [ bump versions in config.json and mobile-config.js ] ===========
            var versions =
                yield dmNpm.bumpVersion("config.json");
            yield dmNpm.bumpVersion("mobile-config.js", versions.release_type, versions.old);
            yield dmNpm.bumpVersion("client/lib/constants.ng.js", versions.release_type, versions.old);

            // meteor build 
            // =========== [ build ] ===========

            // =========== [ sign: get key before build run so that i can do other things in the meantime ] ===========
            var keystorePath = undefined;
            if (config) {
                if (config.keyPath) {
                    keystorePath = dmPath.replace(config.keyPath);
                }
            }
            if (!keystorePath) {
                var chooseKeyAnswer =
                    yield dmPrompt({
                        type: "input",
                        name: "chooseKey",
                        message: "Please enter the key you will use!"
                    });
                var chooseKey = chooseKeyAnswer.chooseKey;
                var keystorePath = dmPath.replace("~/.keystore/" + chooseKey);
            }
            var unsignedApkPath = destination + "/android/release-unsigned.apk";

            // =========== [ get server name ] ===========
            var server = undefined;
            if (config) {
                if (config.server) {
                    server = config.server;
                }
            }
            if (!server) {
                var serverAnswer =
                    yield dmPrompt({
                        type: "input",
                        name: "server",
                        message: "Please enter the deployment server address! [ie: your_app_name.meteor.com]"
                    });
                server = serverAnswer.server;
            }

            // =========== [ build ] ===========
            var command = 'meteor build ' + destination + ' --server=' + server;
            shspawn(command);

            //TODO sign
            // =========== [ sign ] ===========
            if (!test("-f", keystorePath)) {
                var message = "keystore file " + keystorePath.red + " is not existent";
                console.log(message);
            } else {
                var command = "jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore " + keystorePath + " " + unsignedApkPath + " kegelapp";
                shspawn(command);
            }

            //TODO zipalign
            // =========== [ zipalign ] ===========
            var pathRelease = path.resolve(pwd(), "../../releases/android") + "/" + versions.new + ".apk";
            var pathUnaligned = path.resolve(destination, "android/release-unsigned.apk");
            var command = "~/.meteor/android_bundle/android-sdk/build-tools/20.0.0/zipalign 4 " + pathUnaligned + " " + pathRelease;
            shspawn(command);

            // remove app_build
            // =========== [ remove app_build ] ===========
            //exec('rm -rf ' + destination, {
            //silent: false
            //});

            // =========== [ commit bumpVersion changes ] ===========
            yield dmGit.commit(true, "bumped version from " + versions.old + " to " + versions.new);
            // =========== [ push commits ] ===========
            console.log("git push commits".blue);
            exec('git push -u origin master', {
                silent: false
            });

            // =========== [ tag new version ] ===========
            console.log("git tag".blue);
            exec('git tag -a ' + versions.new + ' -m "version ' + versions.new + ' tagged"', {
                silent: false
            });

            // =========== [ push tags ] ===========
            console.log("git push tags".blue);
            exec('git push origin --tags', {
                silent: false
            });
        } else {
            var message = 'Build aborted!'.red;
            console.log(message);
        }

    } catch (e) {
        console.log("Filename: ", __filename, "\n", e.stack);
    }
    return yield Promise.resolve();
}); // job.start()

function shspawn(command) {
    console.log("Started: " + command.yellow);
    var spawn = require('child_process').spawnSync;
    var myProcess = spawn('sh', ['-c', command], {
        stdio: 'inherit'
    });
    console.log("Done: " + command.green);
}

// =========== [ MODULE EXPORT ] ===========
module.exports = job;
