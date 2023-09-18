import type { Page } from "puppeteer"
import { getToken, getTargetPrice, getRecomedation } from "../utils/safra_utils"

export const get_safra_data = async (page: Page, token: string) => {
  const url = `https://www.safra.com.br/resultado-de-busca.htm?query=analise%20${token}`

  try {
    await page.goto(url, { waitUntil: "load" })

    const button = await page.waitForSelector('div.load-more > a.botao-outline')

    if (button !== null) {
      await button.click()
      await button.click()
    }
    
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
        token
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

    return data

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

    return data 

  }
}