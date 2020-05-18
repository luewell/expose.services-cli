'use strict'

module.exports = (options) => {
  return new Promise((resolve, reject) => {
    const io = require('socket.io-client')(options.server)
    const net = require('net')
    const socketIOStream = require('socket.io-stream')

    io.on('connect', () => {
      console.log(`${new Date()}: connected`)
      console.log(`${new Date()}: requesting public url via ${options.server}`)

      io.emit(
        'claim',
        {
          subdomain: options.subdomain,
          hostname: options.hostname,
          port: options.port,
        },
        (response) => {
          if (response) {
            if (response.error) {
              console.log(`${new Date()}: claim error: ${response.error}`)
            } else if (response.url) {
              console.log(`${new Date()}: public url: ${response.url}`)

              resolve(response)
            }
          }

          console.log(response)
        }
      )

      io.on('expose', (params) => {
        const exposeClient = net.connect(options.port, options.hostname, () => {
          const stream = socketIOStream.createStream()

          stream.pipe(exposeClient).pipe(stream)

          stream.on('end', () => {
            exposeClient.destroy()
          })

          socketIOStream(io).emit(params.id, stream)
        })

        exposeClient.setTimeout(1000 * 30)

        exposeClient.on('timeout', () => {
          exposeClient.end()
        })

        client.on('error', () => {
          const stream = socketIOStream.createStream()

          socketIOStream(io).emit(params.id, stream)

          stream.end()
        })
      })
    })
  })
}
