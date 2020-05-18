'use strict'

module.exports = (options) => {
  return new Promise((resolve, reject) => {
    const io = require('socket.io-client')(options.server)
    const net = require('net')
    const socketIOStream = require('socket.io-stream')

    io.on('connect', () => {
      console.log(`requesting public url via ${options.server}`)

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

              // reject(response.error)
            } else if (response.https && response.http) {
              console.log(`public https: ${response.https}`)
              console.log(`public http: ${response.http}`)

              resolve(response)
            } else {
              console.log(response)
            }
          } else {
            console.log(response)
          }
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

        exposeClient.on('error', () => {
          console.log('exposeClient: error')

          const stream = socketIOStream.createStream()

          socketIOStream(io).emit(params.id, stream)

          stream.end()
        })
      })
    })
  })
}
