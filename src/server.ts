import fastify from 'fastify'
import cors from "@fastify/cors"
import views from '@fastify/view'
import forms from '@fastify/formbody'
import ejs from 'ejs'
import path from 'path'
import { getData } from './scrape'

const app = fastify({
  logger: true,
});

const port = 3000;

app.register(views, {
  engine: {
    ejs: ejs,
  },
  root: path.join(__dirname, '..', 'views'),
  viewExt: 'ejs'
})

app.register(cors, {
  origin: "*",
  credentials: true,
})

app.register(forms)

app.get('/',
  (req, res) => {
    res.view('/index', { data: undefined })
  }
)

app.post('/',
  async (req: any, res) => {
    const data = await getData(req.body.name)
    return res.view('/index', {data: data, async: true})
    // return res.view('/index', { data: req.body.name })
  }
)

interface bodyProps {
  enterprise: string
}

// app.post<{ Body: bodyProps }>('/',
//   async (req, res) => {
//     const { enterprise } = req.body
//     // const enterprise = 'gerdau'
//     console.log(enterprise)
//     const data = await getData(enterprise)
//     res.send(data)
//     // res.send('foi')
//   }
// )

app.listen({ port: port, host: "0.0.0.0" }, (err, adress) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }

  app.log.info(`Fastify is listening on port: ${adress}`);
});
