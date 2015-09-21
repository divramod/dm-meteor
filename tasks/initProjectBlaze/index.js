// =========== [ REQUIRE ] ===========
var co = require("co");
var spawn = require("dm-shell").spawn;
var colors = require("colors");
var path = require("path");
var inquirer = require("inquirer");
var dmPath = require("dm-path");
require("shelljs/global");

// =========== [ MODULE DEFINE ] ===========
var task = {};

// =========== [ ASYNC task.start() ] ===========
task.start = co.wrap(function*(projectDirectory) {
    try {
        var projectDirectory = projectDirectory || undefined;
        if (!projectDirectory) {
            projectDirectory = process.cwd();
        }

        // =========== [ create questions ] ===========
        var questions = [{
            type: "input",
            name: "deleteCurrentFiles",
            message: "delete current files [Y]:"
        }, {
            type: "input",
            name: "projectName",
            message: "project name*:"
        }, {
            type: "input",
            name: "projectAlias",
            message: "project alias*:"
        }, {
            type: "input",
            name: "projectDescription",
            message: "project description:"
        }, {
            type: "input",
            name: "server",
            message: "Meteor Server Address (default: PROJECTNAME.meteor.com):"
        }, {
            type: "input",
            name: "keyPath",
            message: "key path (default: ~/.keystore/PROJECTNAME):"
        }, {
            type: "input",
            name: "appId",
            message: "Android App Id (default: com.PROJECTNAME.dev):"
        }];

        inquirer.prompt(questions, function(answers) {
            //console.log(JSON.stringify(answers, null, "  "));

            if (answers.deleteCurrentFiles === "Y") {
                answers.projectDirectory = projectDirectory;
                checkAnswers(answers);
            } else {
                var abortMessage = "Project initialization aborted!";
                return abortMessage.red;
            }
        });
    } catch (e) {
        console.log("Filename: ", __filename, "\n", e.stack);
        return yield Promise.resolve(e);
    }
}); // task.start()

// =========== [ check answers ] ===========
function checkAnswers(answers) {
    var runNext = true;

    if (answers.projectName === "") {
        runNext = false;
        var questions = [{
            type: "input",
            name: "projectName",
            message: "project name*:"
        }];
        inquirer.prompt(questions, function(answersNew) {
            answers.projectName = answersNew.projectName;
            checkAnswers(answers);
        });
    }
    if (runNext && answers.projectAlias === "") {
        runNext = false;
        var questions = [{
            type: "input",
            name: "projectAlias",
            message: "project alias*:"
        }];
        inquirer.prompt(questions, function(answersNew) {
            answers.projectAlias = answersNew.projectAlias;
            checkAnswers(answers);
        });
    }
    if (runNext && answers.server === "") {
        answers.server = answers.projectName;
    }
    if (runNext && answers.keyPath === "") {
        answers.keyPath = dmPath.replace("~/.keystore/" + answers.projectName);
    }
    if (runNext && answers.appId === "") {
        answers.appId = "com." + answers.projectName + ".dev";
    }
    console.log(JSON.stringify(answers, null, "  "));
    if (runNext) {
        run(answers);
    }
}

function run(answers) {
    // =========== [ remove current files ] ===========
    var command = "cd " + answers.projectDirectory + " && ls -lisa && rm -rf * && rm -rf .meteor && ls -lisa";
    spawn(command);

    // =========== [ cp template ] ===========
    var templatePath = path.resolve(__dirname, "template", "*");
    command = "cp -r " + templatePath + " " + answers.projectDirectory;
    spawn(command);

    // =========== [ replace placeholders ] ===========
    // APP_ID, PROJECT_NAME, PROJECT_DESCRIPTION, SERVER, KEYPATH, PROJECT_ALIAS
    var files = find(answers.projectDirectory).filter(function(file) {
        if (test("-f", file)) {
            command = "sed -i 's:APP_ID:" + answers.appId + ":g' '" + file + "'";
            spawn(command);
            command = "sed -i 's:PROJECT_NAME:" + answers.projectName + ":g' '" + file + "'";
            spawn(command);
            command = "sed -i 's:PROJECT_DESCRIPTION:" + answers.projectDescription + ":g' '" + file + "'";
            spawn(command);
            command = "sed -i 's:PROJECT_ALIAS:" + answers.projectAlias + ":g' '" + file + "'";
            spawn(command);
            command = "sed -i 's:SERVER:" + answers.server + ":g' '" + file + "'";
            spawn(command);
            command = "sed -i 's:KEYPATH:" + answers.keyPath + ":g' '" + file + "'";
            spawn(command);
            return true;
        } else {
            return false;
        }
    });

    co(function*() {
        try {


            // =========== [ create key ] ===========
            yield require("./../createKey/index.js").start(answers.projectName, answers.keyPath);

            // =========== [ create meteor project ] ===========

            var command = "cd .. && ls && meteor create " + answers.projectName + "_";
            spawn(command);

            command = "cp -r " + answers.projectDirectory + "_/.meteor " + answers.projectDirectory;
            spawn(command);

            command = "rm -rf " + answers.projectDirectory + "_";
            spawn(command);

            // =========== [ update meteor ] ===========
            command = "meteor update --release METEOR@1.2-rc.7";
            spawn(command);

            // =========== [ install packages ] ===========
            spawn("meteor add iron:router");
            spawn("meteor add less");
            spawn("meteor add twbs:bootstrap");
            spawn("meteor add fortawesome:fontawesome");
            spawn("meteor add accounts-ui");
            spawn("meteor add accounts-password");

            // =========== [ remove packages ] ===========
            spawn("meteor remove insecure");
            spawn("meteor remove autopublish");

            // =========== [ add platform android ] ===========
            command = "meteor add-platform android";
            spawn(command);

            // =========== [ run ] ===========
            command = "meteor run android-device";
            spawn(command);
        } catch (e) {
            console.log("Filename: ", __filename, "\n", e.stack);
        }

    });
}

module.exports = task;
