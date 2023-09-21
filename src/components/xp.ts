import { Page } from "puppeteer"
import { getTargetPrice } from "../utils/safra_utils"

export const get_data_xp = async (page: Page, search: string) => {
  const url = `https://conteudos.xpi.com.br/acoes/${search}`

  try {
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'load' }),
      page.goto(url, { waitUntil: 'load' })
    ])

    await page.exposeFunction('getTargetPrice', getTargetPrice)

    const {recomendation, targetPrice, date} = await page.$eval('#main > div:nth-child(3)',
      async (element) => {
        /* @ts-expect-error: the function getTargetPrice() is not native from window */
        const targetPrice: string = await window.getTargetPrice(element.querySelector("ul > li:nth-child(2)")?.textContent ?? 'Não foi possível localizar o preço-alvo')

        const recomendation = element.querySelector("ul > li:nth-child(5) > span.recomendacao")?.textContent ?? 'Não foi possível localizar a recomendação'
        const date = element.querySelector("div.row.py-4.my-2.top-bordered > div.col-7.text-right > div > p")?.textContent ?? 'Não foi possível localizar a data'

        return { targetPrice, recomendation, date}
      }
    ).catch(
      () => {
        throw new Error('Not found page from XP')
      }
    )

    const data = {
      token: search.toUpperCase(),
      targetPrice: targetPrice,
      recomendation: recomendation,
      src: "XP",
      href: url,
      date: date,
    }

    return data

  } catch(err) {
    console.error(err)

    const data = {
      token: "Não foi possível localizar o token",
      targetPrice: "Não foi possível localizar o preço alvo",
      recomendation: "Não foi possível localizar a recomendação",
      src: "XP",
      href: url,
      date: "Não foi possível localizar a data",
    }

    return data
  }
}