var tasks = {};

// example
tasks.test = require("./tasks/test/index.js").start;

// automatically add tasks here
tasks.cli = require("./tasks/cli/index.js").start;

module.exports = tasks;
