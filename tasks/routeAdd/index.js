// =========== [ REQUIRE ] ===========
var co = require("co");
var path = require("path");
var colors = require("colors");
var inquirer = require("inquirer");
var spawn = require("dm-shell").spawn;
require("shelljs/global");

// =========== [ MODULE DEFINE ] ===========
var task = {};

// =========== [ SYNC task.start() ] ===========
task.start = function(projectDirectoryPath) {
    try {
        // =========== [ params ] ===========
        var projectDirectoryPath = projectDirectoryPath || undefined;
        if (!projectDirectoryPath) {
            projectDirectoryPath = process.cwd();
        }

        // =========== [ proof if current directory has folder client/views/routes ] ===========
        var routesDirectoryPath = path.resolve(projectDirectoryPath, "client", "routes");
        var pathExistent = true;
        if (!test("-d", routesDirectoryPath)) {
            pathExistent = false;
        }

        // =========== [ questions ] ===========
        if (pathExistent) {
            console.log("let's start");

            // =========== [ create questions ] ===========
            var questions = [{
                type: "input",
                name: "routeName",
                message: "route name:"
            }, {
                type: "input",
                name: "routeNamePlural",
                message: "route name plural:"
            }, {
                type: "input",
                name: "routeTitle",
                message: "route title:"
            }];

            inquirer.prompt(questions, function(answers) {
                var params = {};
                params.projectDirectoryPath = projectDirectoryPath;
                params.routesDirectoryPath = routesDirectoryPath;
                params.routeDirectoryPath = path.resolve(routesDirectoryPath, answers.routeName);
                if (!test("-d", params.routeDirectoryPath)) {
                    checkAnswers(answers, params);
                } else {
                    var e = {};
                    e.message = "route existent";
                    console.log(e.message.red);
                    return e;
                }
            });

            return "route created";
        } else {
            var e = {};
            e.message = "creation aborted no client/views/routes directory";
            console.log(e.message.red);
            return e;
        }

    } catch (e) {
        console.log("Filename: ", __filename, "\n", e.stack);
        return e;
    }
}; // task.start()

function checkAnswers(answers, params) {
    var runReady = true;
    if (test("-d", answers.routeDirectoryPath)) {
        runReady = false;
        console.log("route existent");
    }

    if (runReady === true) {
        run(answers, params)
    }
}

function run(a, p) {
    var command = "";
    console.log(a);
    console.log(p);

    // =========== [ copy route ] ===========
    var pathTemplateDirectory = path.resolve(__dirname, "templateBlaze", "route");
    command = "cp -r " + pathTemplateDirectory + " " + p.routeDirectoryPath;
    spawn(command);

    find(p.routeDirectoryPath).filter(function(file) {
        if (test("-f", file) && file.indexOf(".swp") === -1) {
            command = "sed -i 's:ROUTENAME:" + a.routeName + ":g' '" + file + "'";
            spawn(command);
            command = "mv " + file + " " + file.replace("ROUTENAME", a.routeName);
            spawn(command);
            return true;
        }
    });

    // =========== [ add iron route ] ===========
    var r = "";
    r += "// =========== [ automatically ] ===========\n\n";
    r += "Router.map(function() {\n";
    r += "    this.route('" + a.routeName + "', {\n";
    r += "        path: '/" + a.routeName + "',\n";
    r += "        data: {\n";
    r += '            title: "' + a.routeTitle + '"\n';
    r += "        }\n";
    r += "    });\n";
    r += "});\n";

    sed('-i', /.*automatically.*\n/, r, path.join(p.projectDirectoryPath, "client", "routes.js"));


    var routeCapitalize = a.routeName.charAt(0).toUpperCase() + a.routeName.slice(1);

    //TODO
    // =========== [ add link ] ===========

    // =========== [ add subscription ] ===========
    var r = "";
    r += "// =========== [ automatically ] ===========\n\n";
    r += 'Meteor.subscribe("' + a.routeName + '");\n';
    sed('-i', /.*automatically.*\n/, r, path.join(p.projectDirectoryPath, "client", "lib", "subscriptions.js"));

    // =========== [ add publication ] ===========
    var r = "";
    r += "// =========== [ automatically ] ===========\n\n";
    r += 'Meteor.publish("' + a.routeName + '", function () {\n';
    r += '    return ' + routeCapitalize + '.find();\n';
    r += "});";
    sed('-i', /.*automatically.*\n/, r, path.join(p.projectDirectoryPath, "server", "publications.js"));

    // =========== [ add collection ] ===========
    var r = "";
    r += "// =========== [ automatically ] ===========\n\n";
    r += routeCapitalize + ' = new Mongo.Collection("' + a.routeName + '");\n';
    sed('-i', /.*automatically.*\n/, r, path.join(p.projectDirectoryPath, "lib", "collections.js"));

    // =========== [ add methods ] ===========
    var r = "";
    r += "// =========== [ automatically ] ===========\n\n";
    r += "";
    r += "Meteor.methods({\n";
    r += "    add" + routeCapitalize + ": function(text) {\n";
    r += "        if (!Meteor.userId()) {\n";
    r += '            throw new Meteor.Error("not-authorized");\n';
    r += "        }\n\n";
    r += "        " + routeCapitalize + ".insert({\n";
    r += "            text: text,\n";
    r += "            createdAt: new Date(),\n";
    r += "            owner: Meteor.userId(),\n";
    r += "            username: Meteor.user().username\n";
    r += "        });\n";
    r += "    },\n";
    r += "    delete" + routeCapitalize + ": function(taskId) {\n";
    r += "        " + routeCapitalize + ".remove(" + a.routeName + "Id);\n";
    r += "    }\n";
    r += "});\n";
    sed('-i', /.*automatically.*\n/, r, path.join(p.projectDirectoryPath, "lib", "methods.js"));


    // =========== [ proof ] ===========
    //spawn("ls " + p.routesDirectoryPath);
    //spawn("ls " + path.resolve(p.routesDirectoryPath, a.routeName));
}

// =========== [ MODULE EXPORT ] ===========
module.exports = task;
