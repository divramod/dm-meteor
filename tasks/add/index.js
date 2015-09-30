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
      .option('-r, --routes [value]', 'create routes in /client/routes.js. ie: "-r hd" (creates only home and delete route) default: "hrcud"', "hcrud")
      .option('-t, --templates [value]', 'create templates in /client/routes/ROUTENAME/templates/?.html. ie: "-t hl" (creates only home and list templates) default: "hrcudl"', "hcrudl")
      .option('-s, --styles [value]', 'create templates in /client/routes/ROUTENAME/styles/ROUTENAME.*. ie: "-s cl" (creates css and less) default: "l"', "l")
      .option('-p, --pubsub [value]', 'Add (p)ublication/(s)ubscription! default: ps', 'ps')
      .option('-i, --i18n [value]', 'Add (n)av/(r)outes/(s)chema! default: nrs', 'nrs')
      .option('-c, --collection [value]', 'Add /lib/collections/PLURAL/ (a)llow/(d)eny/(m)ethods/(s)chemas/(t)ables/! default: admst', 'admst')
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
  crudRun(program, actions);
}

// =========== [ crudRun(actions) ] ===========
function crudRun(program, actions) {
  var routeInformation = getFormatedRouteInformation(program);
  console.log(routeInformation);
  console.log(actions);

  // =========== [ routes: /client/routes.js ] ===========

  // =========== [ templates: /client/routes/templates ] ===========

  // =========== [ styles: /client/routes/styles ] ===========

  // =========== [ subscription (pubsub): /client/lib/subscriptions ] ===========

  // =========== [ publications (pubsub): /server/publications ] ===========

  // =========== [ i18n: /i18n ] ===========
  var projectLanguages = getProjectLanguages();

  // =========== [ collection: /lib/collections/PLURAL/ ] ===========

  // =========== [ navigation ] ===========
  //value: "menu_meta_data",
  //name: "menu_dynamic_data",
  //name: "menu_test",

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
  routeInformation.pluralcCapitalized = program.plural.charAt(0).toUpperCase() + program.plural.slice(1);
  //console.log(JSON.stringify(routeInformation, null, "  "));
  return routeInformation;
}

// =========== [ MODULE EXPORT ] ===========
module.exports = task;
