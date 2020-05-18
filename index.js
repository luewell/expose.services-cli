'use strict'

const commander = require('./src/commander.js')(process.argv)

require('./src/cli.js')(commander)
