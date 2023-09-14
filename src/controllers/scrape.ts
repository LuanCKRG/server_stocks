import type { FastifyReply, FastifyRequest } from "fastify"
import puppeteer from "puppeteer"
import "dotenv/config"
import { getToken, getTargetPrice, getRecomedation } from "../utils/safra_utils"

interface getDataProps {
  token: string
}

export const safra_data = {
  index: (req: FastifyRequest, res: FastifyReply) => {
    return res.view('index', {data: undefined})
  },

  get: async ({ body }: FastifyRequest<{ Body: getDataProps }>, res: FastifyReply) => {
    const enterprise = body.token.toLowerCase()

    console.log(enterprise)
    const url = `https://www.safra.com.br/resultado-de-busca.htm?query=analise%20${enterprise}`

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

      const button  = await page.waitForSelector('div.load-more > a.botao-outline')
      await button?.click()
      await button?.click()
      await button?.dispose()
      
      await Promise.all([
        page.exposeFunction('getToken', getToken),
        page.waitForNavigation({ waitUntil: "load" }),
        page.$$eval(
          "div.s-col-12.resultados > div",
          async (elements, enterprise: string) => {


            for (const element of elements) {
              console.log(element)
              /* @ts-expect-error: the function getToken() is not native from window */
              const token: string = await window.getToken(element.querySelector('p.cat')?.textContent ?? 'Não deu não mano').then((token: string) => token.toLowerCase())

              if (token === enterprise) {
                element.querySelector('a')?.click()
                break
              }
            }
          },
          enterprise
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

      const data = {
        token: 'Não foi possível localizar o token',
        targetPrice: 'Não foi possível localizar o preço alvo',
        recomendation: 'Não foi possível localizar a recomendação',
        src: "Banco Safra",
        href: url,
        date: 'Não foi possível localizar a data',
      }

      return res.view('index', { data: data })

    } finally {
      await page.close()
      await browser.close()
    }
  }
}