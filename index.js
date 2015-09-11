var tasks = {};

// automatically add tasks here
tasks.routeAdd = require("./tasks/routeAdd/index.js").start;
tasks.initProjectBlaze = require("./tasks/initProjectBlaze/index.js").start;
tasks.cli = require("./tasks/cli/index.js").start;

module.exports = tasks;
