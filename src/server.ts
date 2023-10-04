import { env } from "./env"
import { app } from "./app"
import {cron} from './lib/cron'

app.listen({ port: env.PORT, host: "0.0.0.0" }, (err, adress) => {
  if (err) {
    app.log.error(err)
    process.exit(1)
  }

  if (env.NODE_ENV === 'dev') {
    app.log.info(`Fastify is listening on port: ${adress}`)
  }

  if (env.NODE_ENV === 'production') {
    app.log.info(`Fastify is listening!!`)
  }

})

cron.startRender()