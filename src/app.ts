import fastify from 'fastify'
import { routes } from './routes'
import cors from "@fastify/cors"
import views from '@fastify/view'
import forms from '@fastify/formbody'
import ejs from 'ejs'
import path from 'path'

export const app = fastify({
  logger: true,
})

app.register(forms)

app.register(routes)

app.register(views, {
  engine: {
    ejs: ejs,
  },
  root: path.join(__dirname, '/', 'views'),
  viewExt: 'ejs'
})

app.setErrorHandler(
  (err, req, res) => {
    if (true) {
      console.error(err)
    }
  
    return res.status(500).send({message: 'Internal server error.'})
  }
)