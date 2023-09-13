import { safra_data } from "controllers/scrape";
import type { FastifyInstance } from "fastify";

export const routes = async (app: FastifyInstance) => {
  app.get('/', safra_data.index)

  app.post('/', safra_data.get)

}