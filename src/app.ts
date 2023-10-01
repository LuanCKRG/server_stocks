import fastify from "fastify"
import { routes } from "./routes"
import cors from "@fastify/cors"
import views from "@fastify/view"
import forms from "@fastify/formbody"
import ejs from "ejs"
import path from "path"
import { ZodError } from "zod"

export const app = fastify({
  logger: true,
})

app.register(forms)

app.register(cors)

app.register(routes)

app.register(views, {
  engine: {
    ejs: ejs,
  },
  root: path.join(__dirname, "/", "views"),
  viewExt: "ejs"
})

app.setErrorHandler(
  (err, req, res) => {
    if (err instanceof ZodError) {
      return res.status(400).send({ message: 'Validation error', issues: err.format()})
    }

    if (true) {
      console.error(err)
    }
  
    return res.status(500).send({message: "Internal server error."})
  }
)