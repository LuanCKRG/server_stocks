import type { FastifyReply, FastifyRequest } from "fastify"
import puppeteer from "puppeteer"
import "dotenv/config"
import { getToken, getTargetPrice, getRecomedation } from "utils/safra_utils"

interface getDataProps {
  token: string
}

export const safra_data = {
  index: (req: FastifyRequest, res: FastifyReply) => {
    return res.view('index', {data: undefined})
  },

  get: async ({ body }: FastifyRequest<{ Body: getDataProps }>, res: FastifyReply) => {
    const enterprise = body.token

    console.log(enterprise)
    const url = `https://www.safra.com.br/resultado-de-busca.htm?query=analise%20${enterprise}`
    // const browser = await puppeteer.launch({ args: [], executablePath: exePath, headless: true })

    const browser = await puppeteer.launch({
      headless: true,
      executablePath: '/usr/bin/chromium-browser',
      args: [
        '--no-sandbox',
        '--disable-gpu',
      ]
    })

    const page = await browser.newPage()

    try {
      await page.goto(url, { waitUntil: "load" })

      await Promise.all([
        page.waitForNavigation({ waitUntil: "load" }),
        page.$eval(
          "div.s-col-12.resultados > div:nth-child(1) > a",
          (element) => {
            console.log(element)
            element.click()
          }
        ),
      ])

      const href = page.url()

      const { date, subtitle, title } = await Promise.all([
        page.$eval("h1.titulo", (element) => {
          return element.textContent ?? ""
        }),
        page.$eval("h2.sub", (element) => {
          return element.textContent ?? ""
        }),
        page.$eval("span.info", (element) => {
          return element.textContent ?? ""
        }),
      ]).then((value) => {
        return {
          title: value[0],
          subtitle: value[1],
          date: value[2],
        }
      })

      const data = {
        token: getToken(title),
        targetPrice: getTargetPrice(subtitle),
        recomendation: getRecomedation(subtitle),
        src: "Banco Safra",
        href,
        date,
      }

      return res.view('index', { data: data })

    } catch (err) {
      console.error(err)


    } finally {
      await page.close()
      await browser.close()
    }
  }
}