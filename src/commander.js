'use strict'

module.exports = (argv) => {
  const { program } = require('commander')

  program.option(
    '-host, --hostname [string]',
    'Address of local server for forwarding',
    'localhost'
  )
  program.option('-p, --port [number]', 'Port of local server for forwarding', '80')
  program.option(
    '-sub, --subdomain [string]',
    '(Optional) Public URL the tunnel server is forwarding to us',
    ''
  )
  program.option(
    '-s, --server [string]',
    '(Optional) API server endpoint',
    'https://api-cli.expose.services'
  )

  program.parse(argv)

  return program
}
