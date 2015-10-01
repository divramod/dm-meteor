/**
 * Shortcuts
 *      s: shortcut for singular
 *      p: shortcut for plural
 *      sc: shortcut for singular with capitalized first letter
 *      pc: shortcut for plural with capitalized first letter
 */

// =========== [ REQUIRE ] ===========
var co = require("co");
var inquirer = require("inquirer");
var program = require('commander');
var path = require("path");
var moment = require("moment");
var spawn = require("dm-shell").spawn;
require("shelljs/global");


// =========== [ MODULE DEFINE ] ===========
var task = {};

// =========== [ SYNC task.start() ] ===========
task.start = function() {
  try {

    // =========== [ define program ] ===========
    program
      .version('0.0.1')
      .option('p, --plural [value]', 'The entities plural name!')
      .option('s, --singular [value]', 'The entities singular name!')
      .option('-r, --routes [value]', '/client/routes/NAME delete|edit|home|list|new|show "dehlns"', "dehlns")
      .option('-t, --templates [value]', '/client/routes/NAME/templates/NAME find|find(o)ne|insert|remove|update "foiru"', "foiru")
      .option('-c, --collection [value]', '/lib/collections/NAME/ (c)ollection/(m)ethods/(s)chemas/(t)ables/sec(u)rity/! default: cmstu', 'cmstu')
      .option('-s, --styles [value]', '/client/routes/ROUTENAME/styles/NAME css|less', "cl")
      .option('-p, --pubsub [value]', 'Add (p)ublication/(s)ubscription! default: ps', 'ps')
      .option('-i, --i18n [value]', 'Add (n)av/(r)outes/(s)chema! default: nrs', 'nrs')
      .parse(process.argv);

    // =========== [ show help ] ===========
    if (program.rawArgs.length < 4) {
      program.outputHelp();
    } else {
      //console.log(program);
      getRouteInformation(program);
    }

  } catch (e) {
    console.log("Filename: ", __filename, "\n", e.stack);
    return e;
  }
}; // task.start()

// =========== [ getRouteInformation() ] ===========
function getRouteInformation(program) {
  if (program.singular && program.plural) {
    routeType(program);
  } else {
    var questions = [{
      type: "input",
      name: "s",
      message: "singular entity name (used in forms etc)"
    }, {
      type: "input",
      name: "p",
      message: "plural entity name (used as route name etc)"
    }];

    inquirer.prompt(questions, function(program) {
      routeType(program);
    });
  }
}
// =========== [ routeType(routeInformation) ] ===========
function routeType(program) {
  inquirer.prompt([{
      type: "list",
      name: "routeType",
      message: "Which kind of route do you want to create?",
      choices: [
        "crud",
        "simple"
      ]
    }],
    function(answers) {
      if (answers.routeType === "crud") {
        crud(program);
      } else if (answers.routeType === "simple") {
        simple(program);
      }
    });
}

// =========== [ simple ] ===========
function simple() {
  console.log("simple");
}

// =========== [ questions ] ===========
function crud(program) {
  var actions = {};
  for (var i = 0, l = program.options.length; i < l; i++) {
    var option = program.options[i];
    var optionName = option.long.substring(2, option.long.length);
    if (optionName !== "version") {
      if (program[optionName]) {
        //console.log(optionName, " ", program[optionName]);
        actions[optionName] = program[optionName];
      }
    }
  }
  crudCreate(program, actions);
}

// =========== [ crudRun(actions) ] ===========
// add hooks for removing
function crudCreate(program, actions) {
  // def
  var projectPath = process.cwd();
  var routeInformation = getFormatedRouteInformation(program);
  var replaceArray = getReplaceArray(routeInformation);

  // =========== [ routes: /client/routes.js ] ===========
  // copy and replace files
  var routeFileNames = actions.routes;
  var routeFileTemplatesDirectoryPath = path.resolve(__dirname, "templates", "blaze", "routes");
  var routeFilesDestinationPath = path.resolve(projectPath, "client", "routes", routeInformation.plural, "routes");
  var routeFileMapper = {
    "d": "delete",
    "e": "edit",
    "h": "home",
    "l": "list",
    "n": "new",
    "s": "show"
  };
  copyAndReplaceFiles(replaceArray, routeFileNames, routeFileTemplatesDirectoryPath, routeFilesDestinationPath, routeFileMapper);

  // =========== [ templates: /client/routes/templates ] ===========
  // copy and replace files
  var templateFileNames = actions.templates;
  var templateFileTemplatesDirectoryPath = path.resolve(__dirname, "templates", "blaze", "templates");
  var templateFilesDestinationPath = path.resolve(projectPath, "client", "routes", routeInformation.plural, "templates");
  var templateFileMapper = {
    "f": "find",
    "o": "readOnly",
    "i": "insert",
    "r": "remove",
    "u": "update"
  };
  copyAndReplaceFiles(replaceArray, templateFileNames, templateFileTemplatesDirectoryPath, templateFilesDestinationPath, templateFileMapper);

  // =========== [ collection: /lib/collections/PLURAL/ ] ===========
  // copy and replace files
  var collectionFileNames = actions.collection;
  var collectionFileTemplatesDirectoryPath = path.resolve(__dirname, "templates", "blaze", "collection");
  var collectionFilesDestinationPath = path.resolve(projectPath, "lib", "collections", routeInformation.plural);
  var collectionFileMapper = {
    "c": "collection",
    "m": "methods",
    "s": "schemas",
    "t": "tables",
    "u": "security"
  };
  copyAndReplaceFiles(replaceArray, collectionFileNames, collectionFileTemplatesDirectoryPath, collectionFilesDestinationPath, collectionFileMapper);

  // =========== [ styles: /client/routes/PLURAL/styles ] ===========
  // copy and replace files
  var styleFileNames = actions.styles;
  var styleFileTemplatesDirectoryPath = path.resolve(__dirname, "templates", "blaze", "styles");
  var styleFilesDestinationPath = path.resolve(projectPath, "client", "routes", routeInformation.plural, "styles");
  var styleFileMapper = {
    "c": "css",
    "l": "less"
  };
  copyAndReplaceFiles(replaceArray, styleFileNames, styleFileTemplatesDirectoryPath, styleFilesDestinationPath, styleFileMapper);

  // =========== [ subscription (pubsub): /client/lib/subscriptions ] ===========
  //TODO addToFile

  // =========== [ publications (pubsub): /server/publications ] ===========
  //TODO addToFile

  // =========== [ i18n: /i18n ] ===========
  //TODO addToFile
  var projectLanguages = getProjectLanguages();

  // =========== [ navigation ] ===========
  //TODO addToFile
  //value: "menu_meta_data",
  //name: "menu_dynamic_data",
  //name: "menu_test",

}

// =========== [ addToFile() ] ===========
function addToFile(filePath, hook, insertString) {

}

// =========== [ copyAndReplaceFiles() ] ===========
function copyAndReplaceFiles(replaceArray, fileNames, fileTemplatesDirectoryPath, filesDestinationPath, fileMapper) {
  // create path if not existent
  if (!test("-d", filesDestinationPath)) {
    var command = "mkdir -p " + filesDestinationPath;
    spawn(command);
  }

  var backupTime = moment().format("YYYYMMDD_HHmmss");
  // run through passed routes
  for (var i = 0, l = fileNames.length; i < l; i++) {
    var route = fileNames[i];

    // test if route is passed
    if (fileMapper[route]) {
      // srcFiles
      var templatesSearchGlob = path.resolve(fileTemplatesDirectoryPath, fileMapper[route] + ".*");
      var templateFiles = ls(templatesSearchGlob);

      for (var ii = 0, ll = templateFiles.length; ii < ll; ii++) {
        var templateFilePath = templateFiles[ii];
        var destFilePath = path.resolve(filesDestinationPath, templateFilePath.substring(templateFilePath.lastIndexOf("/") + 1, templateFilePath.length));

        // test if destFilePath existing, if yes mv file to backup
        if (test("-f", destFilePath)) {
          var command = "mv " + destFilePath + " " + destFilePath + "_" + backupTime;
          spawn(command);
        }

        // create file
        var command = "cp " + templateFilePath + " " + destFilePath;
        spawn(command);

        // replace strings
        replaceStringsInFile(destFilePath, replaceArray);
      }
    }
  }
  
}

// =========== [ getReplaceArray() ] ===========
function getReplaceArray(replacer) {
  var replaceArray = [];
  replaceArray.push(["PLURALC", replacer.pluralCapitalized]);
  replaceArray.push(["PLURAL", replacer.plural]);
  replaceArray.push(["SINGULARC", replacer.singularCapitalized]);
  replaceArray.push(["SINGULAR", replacer.singular]);
  return replaceArray;
}

// =========== [ replaceStringsInFile(path, replaceArray) ] ===========
function replaceStringsInFile(path, replaceArray) {

  for (var i = 0, l = replaceArray.length; i < l; i++) {
    var v = replaceArray[i];
    command = "sed -i 's:" + v[0] + ":" + v[1] + ":g' '" + path + "'";
    //console.log(command);
    spawn(command);
  }

}

// =========== [ getProjectLanguages ] ===========
function getProjectLanguages() {
  var languages = [];
  var i18nFiles = ls("i18n");
  for (var i = 0, l = i18nFiles.length; i < l; i++) {
    var fileName = i18nFiles[i];
    var fileNameParts = fileName.split('.');
    if (fileNameParts.length === 3) {
      languages.push(fileNameParts[0]);
    }
  }
  return languages;
}

// =========== [ getFormatedRouteInformation ] ===========
function getFormatedRouteInformation(program) {
  var routeInformation = {};
  routeInformation.singular = program.singular.toLowerCase();
  routeInformation.singularCapitalized = program.singular.charAt(0).toUpperCase() + program.singular.slice(1);
  routeInformation.plural = program.plural.toLowerCase();
  routeInformation.pluralCapitalized = program.plural.charAt(0).toUpperCase() + program.plural.slice(1);
  //console.log(JSON.stringify(routeInformation, null, "  "));
  return routeInformation;
}

// =========== [ MODULE EXPORT ] ===========
module.exports = task;
