import fastify from 'fastify'
import cors from "@fastify/cors"
import views from '@fastify/view'
import ejs from 'ejs'
import { getData } from './puppeteer'

const app = fastify({
  logger: true,
});

app.register(cors, {
  origin: "*",
});

const port = 3000;
app.register(views, {
  engine: {
    ejs: ejs
  }
})

app.get('/',
  (req, res) => {
    res.view('/views/index.ejs')
  }
)

app.post<{ Body: string }>('/',
  async (req, res) => {
    const enterprise = req.body
    // const enterprise = 'gerdau'
    console.log(enterprise)
    const data = await getData(enterprise)
    res.send(data)
    // res.send('foi')
  }
)

app.post<{ Body: string }>("/", async (req, res) => {
  const enterprise = req.body;
  // const enterprise = 'gerdau'
  const data = await getData(enterprise);
  res.send(data);
});

app.listen({ port: port, host: "0.0.0.0" }, (err, adress) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }

  app.log.info(`Fastify is listening on port: ${adress}`);
});
