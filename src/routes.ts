import type { FastifyInstance } from "fastify"
import { data } from "./controllers/scrape"

export const routes = async (app: FastifyInstance) => {
  app.get("/", data.index)  

  app.post("/", data.get)
}