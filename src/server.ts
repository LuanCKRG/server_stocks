import { app } from 'app'

const port = 3000

app.listen({ port: port, host: "0.0.0.0" }, (err, adress) => {
  if (err) {
    app.log.error(err)
    process.exit(1)
  }

  app.log.info(`Fastify is listening on port: ${adress}`)
})
