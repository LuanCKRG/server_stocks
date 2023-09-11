import fastify from "fastify";

import { getData } from "./puppeteer";

const app = fastify({
  logger: true,
});

const port = 3000;

app.post<{ Body: string }>("/", async (req, res) => {
  const { enterprise } = JSON.parse(req.body);
  const data = await getData({ enterprise });
  res.send(data);
});

app.listen({ port: port, host: "0.0.0.0" }, (err, adress) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }

  app.log.info(`Fastify is listening on port: ${adress}`);
});
