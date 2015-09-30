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

    program
      .version('0.0.1')
      //.option('-singular, --s', 'Route Singular Name')
      //.option('-s --s [value] ', 'The entities singular name!')
      .option('-p, --plural [value]', 'The entities plural name!')
      .parse(process.argv);

    console.log(program);
    //program.on('--help', function() {
      //program.outputHelp();
    //});

    //getRouteInformation(program);
  } catch (e) {
    console.log("Filename: ", __filename, "\n", e.stack);
    return e;
  }
}; // task.start()

// =========== [ getRouteInformation() ] ===========
function getRouteInformation(program) {
  try {
    if (program.s && program.p) {
      routeType(getFormatedRouteInformation(program), program);
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
        routeType(getFormatedRouteInformation(program), program);
      });
    }
  } catch (e) {
    console.log("Filename: ", __filename, "\n", e.stack);
  }
}
// =========== [ getFormatedRouteInformation ] ===========
function getFormatedRouteInformation(program) {
  var routeInformation = {};
  routeInformation.s = program.s.toLowerCase();
  routeInformation.sc = program.s.charAt(0).toUpperCase() + program.s.slice(1);
  routeInformation.p = program.p.toLowerCase();
  routeInformation.pc = program.p.charAt(0).toUpperCase() + program.p.slice(1);
  console.log(JSON.stringify(routeInformation, null, "  "));
  return routeInformation;
}

// =========== [ routeType(routeInformation) ] ===========
function routeType(routeInformation, program) {
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
      //console.log(JSON.stringify(answers, null, "  "));
      if (answers.routeType === "crud") {
        crud(routeInformation, program);
      } else if (answers.routeType === "simple") {
        simple(routeInformation, program);
      }
    });
}

// =========== [ simple ] ===========
function simple() {
  console.log("simple");
}



// =========== [ questions ] ===========
function crud(routeInformation, program) {
  //var languages = getProjectLanguages();
  //var choicesLanguages = 

  var choicesAll = ["routeHome", "routeInsert"];
  var choices = [];
  for (var i = 0, l = choicesAll.length; i < l; i++) {
    var ca = choicesAll[i];
    console.log(program);
    if (program[ca]) {
      console.log(ca);
    }
  }

  var choicesStandard = [
    // =========== [ Routes /client/routes.js] ===========
    new inquirer.Separator("routes (/client/routes.js)"), {
      value: "routeHome",
      name: "home",
      checked: true
    }, {
      value: "routeInsert",
      name: "insert",
      checked: true
    }, {
      value: "routeUpdate",
      name: "update",
      checked: true
    },
    // =========== [ Routes templates ] ===========
    new inquirer.Separator("templates (/client/routes/ " + routeInformation.p + "/tpl/*.html)"), {
      value: "tmplHome",
      name: "home",
      checked: true
    }, {
      value: "tmplList",
      name: "list",
      checked: true
    }, {
      value: "tmplInsert",
      name: "insert",
      checked: true
    }, {
      value: "tmplUpdate",
      name: "update",
      checked: true
    }, {
      value: "tmplDelete",
      name: "delete",
      checked: true
    },
    // =========== [ Route styles ] ===========
    new inquirer.Separator("templates (/client/routes/ " + routeInformation.p + "/styles/" + routeInformation.p + ".[less|css])"), {
      value: "styleLess",
      name: "less",
      checked: true
    }, {
      value: "styleCss",
      name: "css",
      checked: false
    },
    // =========== [ /client/lib/subscriptions && /server/publications] ===========
    new inquirer.Separator("Publish/Subscribe"), {
      value: "publication",
      name: "publication (/server/publications.js)",
      checked: true
    }, {
      value: "subscription",
      name: "subscription (/client/lib/subscriptions.js)",
      checked: true
    },
    // =========== [ /i18n ] ===========
    new inquirer.Separator("internationalisation (/i18n)"), {
      value: "i18nNav",
      name: "i18n Navigation (/i18n/nav.LANGUAGE.i18n.json) ",
      checked: true
    }, {
      value: "i18nRoutes",
      name: "i18n Routes (/i18n/routes.LANGUAGE.i18n.json) ",
      checked: true
    }, {
      value: "i18nSchemas",
      name: "i18n Schemas (/i18n/schemas.LANGUAGE.i18n.json) ",
      checked: true
    },
    // =========== [ lib/collections ] ===========
    new inquirer.Separator("collection (/lib/collections)"), {
      value: "collectionSecurity",
      name: "/lib/collections/PLURAL/security.js",
      checked: true
    }, {
      value: "collectionMethods",
      name: "/lib/collections/PLURAL/methods.js",
      checked: true
    }, {
      value: "collectionSchemas",
      name: "/lib/collections/PLURAL/schemas.js",
      checked: true
    }, {
      value: "collectionSchemasI18n",
      name: "i18n /lib/collections/PLURAL/schemas.js",
      checked: true
    }, {
      value: "collectionTables",
      name: "/lib/collections/PLURAL/tables.js",
      checked: true
    },
    // =========== [ navigation ] ===========
    new inquirer.Separator("navigation entries"), {
      value: "nav_meta_data",
      name: "Meta Data",
      checked: true
    }, {
      value: "nav_dynamic_data",
      name: "Dynamic Data",
      checked: false
    }, {
      value: "nav_test",
      name: "Test",
      checked: false
    }
  ];

  // =========== [ start prompt ] ===========
  inquirer.prompt([{
      type: "checkbox",
      message: "Select options for route " + routeInformation.p,
      name: "routeoptions",
      choices: choices
    }],
    function(answers) {
      console.log(JSON.stringify(answers, null, "  "));
    });
}

// =========== [ crudRun(actions) ] ===========
function crudRun(actions) {
  // =========== [ /client/routes.js ] ===========
  // 1. run through all actions and proof if task with indexOf route_ is existing
  //value: "route_home",
  //value: "route_insert",
  //value: "route_update",

  // =========== [ /client/routes/templates ] ===========
  // 1. run through all actions and proof if task with indexOf tmpl_ is existing
  //value: "tmpl_home",
  //value: "tmpl_list",
  //value: "tmpl_insert",
  //value: "tmpl_update",
  //value: "tmpl_delete",

  // =========== [ /client/routes/styles ] ===========
  //value: "style_less",
  //value: "style_css",

  // =========== [ /client/lib/subscriptions ] ===========
  //value: "subscription",
  //name: "subscription (/client/lib/subscriptions)",

  // =========== [ /server/publications ] ===========
  //value: "publication",
  //name: "publication (server/publications)",

  // =========== [ /i18n ] ===========
  //name: "i18n",


  //value: "collection_security",
  //name: "/lib/collections/PLURAL/security.js",
  //value: "collection_methods",
  //name: "/lib/collections/PLURAL/methods.js",
  //value: "collection_schemas",
  //name: "/lib/collections/PLURAL/schemas.js",
  //value: "collection_schemas_i18n",
  //name: "i18n /lib/collections/PLURAL/schemas.js",
  //value: "collection_tables",
  //name: "/lib/collections/PLURAL/tables.js",
  //value: "menu_meta_data",
  //name: "menu_dynamic_data",
  //name: "menu_test",

}

// =========== [ getProjectLanguages ] ===========
function getProjectLanguages() {
  var languages = [];
  var i18nFiles = ls("i18n");
  console.log(i18nFiles);

  return languages;
}

// =========== [ MODULE EXPORT ] ===========
module.exports = task;
