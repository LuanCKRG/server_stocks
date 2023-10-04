import type { Page } from "puppeteer"
import { getToken, getTargetPrice, getRecomedation } from "../utils/stocks"
import { Firebase } from "../lib/firebase"
import { Stock } from "types"

export const get_safra_data = async (page: Page, token: string) => {
  const url = `https://www.safra.com.br/resultado-de-busca.htm?query=analise%20${token}`

  try {
    await page.goto(url, { waitUntil: 'domcontentloaded' })

    try {
      await page.waitForSelector('div.load-more > a.botao-outline')
      await page.click('div.load-more > a.botao-outline')
      await page.click('div.load-more > a.botao-outline')
    } catch (err) {
      console.error(err)
    }

    await page.exposeFunction('getToken', getToken)

    await page.waitForSelector('div.s-col-12.resultados > div').catch((err) => console.error(err))

    await Promise.all([
      page.waitForNavigation({ waitUntil: "domcontentloaded" }),
      page.$$eval(
        "div.s-col-12.resultados > div",
        async (elements, enterprise: string) => {

          for (const element of elements) {
            /* @ts-expect-error: the function getToken() is not native from window */
            const token: string = await window.getToken(element.querySelector('p.cat')?.textContent ?? '')
              .then((value: string) => value.toLowerCase())
              .catch(() => 'Algo deu errado')

            if (token === enterprise) {
              element.querySelector('a')?.click()
              break
            }
          }
        },
        token
      ),
    ]).catch(
      (err) => {
        console.error(err)
        throw new Error('Token not found on safra')
      }
    )

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
    }).catch(() => {
      throw new Error('Not found date, subtitle, tilte from safra')
    })

    const data: Stock = {
      created_at: new Date(),
      token: getToken(title),
      targetPrice: getTargetPrice(subtitle),
      recomendation: getRecomedation(subtitle),
      src: "Banco Safra",
      href,
      date,
      org: 'safra'
    }

    console.log('Safra sucessed!!')

    Firebase.setStock(data)

    return data
  } catch (err) {
    console.error(err)

    const data: Stock = {
      created_at: new Date(),
      token: 'Não foi possível localizar o token',
      targetPrice: 'Não foi possível localizar o preço alvo',
      recomendation: 'Não foi possível localizar a recomendação',
      src: "Banco Safra",
      href: url,
      date: 'Não foi possível localizar a data',
      org: 'safra'
    }

    return data
  }
}