import axios from "axios"
import {JSDOM} from 'jsdom'
import { Page } from "puppeteer"

export const get_data_genial = async (page: Page, search: string) => {
  const url = `https://analisa.genialinvestimentos.com.br/acoes/`

  try {
    await page.goto(url, { waitUntil: 'load' })

    await page.waitForSelector("input[type=text][placeholder='o que está procurando?']")
    await page.focus("input[type=text][placeholder='o que está procurando?']")
    await page.keyboard.type(search).catch(
      (err) => {
        console.error(err)
        throw new Error('Error on Input(Inter)')
      }
    )
    await page.click('button[type=submit]')

    await page.waitForSelector('section.sc-92d84526-0.kbGCZi > div > div.sc-78436ac0-0.hLPVov > table > tbody > tr')

    const { token, recomendation, targetPrice, href } = await page.$$eval('section.sc-92d84526-0.kbGCZi > div > div.sc-78436ac0-0.hLPVov > table > tbody > tr',
      (elements, search) => {
        for (const element of elements) {
          const token = element.querySelector('td:nth-child(2) > span > div > a')?.textContent

          if (token === search.toUpperCase()) {
            const recomendation = element.querySelector('td:nth-child(5) > div > a')?.textContent
            const href = element.querySelector<HTMLAnchorElement>('td:nth-child(5) > div > a')?.href
            const targetPrice = element.querySelector('td:nth-child(6) > div > a')?.textContent

            return { token, targetPrice, recomendation, href }
          } else {
            throw new Error('Token not found on Genial')
          }
        }
      }, search
    ).then(
      (value) => {
        return {
          recomendation: value?.recomendation,
          targetPrice: value?.targetPrice,
          token: value?.token,
          href: value?.href
        }
      }
    ).catch(
      (err) => {
        console.error(err)
        throw new Error('Error on Genial component')
      }
    )

    // await Promise.all([
    //   page.waitForNavigation({ waitUntil: "domcontentloaded" }),
    //   page.click("div#__next > main > div > ul > li > a")
    // ])

    // await page.waitForSelector('div#__next > div.sc-a45f5184-0.fkSeGq > main > ul > li')

    // const { token, targetPrice, recomendation } = await page.$eval('div#__next > div.sc-a45f5184-0.fkSeGq > main > ul > li',
    //   (element) => {
    //     const recomendation = element.querySelector("div:nth-child(1) > h2")?.textContent
    //     const token = element.querySelector("div:nth-child(2) > p:nth-child(2)")?.textContent
    //     const targetPrice = element.querySelector("div:nth-child(4) > p:nth-child(2)")?.textContent

    //     return { token, targetPrice, recomendation }
    //   }
    // ).catch(
    //   (err) => {
    //     console.error(err)
    //     throw new Error('Page not found on Genial')
    //   }
    // )

    // const href = page.url()

    const res = {
      token: token ?? 'Não foi possível localizar o token',
      targetPrice: targetPrice ?? 'Não foi possível localizar o preço-alvo',
      recomendation: recomendation ?? 'Não foi possível localizar a recomendação',
      src: "Genial Investimentos",
      href: href ?? url,
      date: "Não fornecido por Genial Investimentos"
    }

    console.log('Genial sucessed!!')

    return res

  } catch (err) {
    console.error(err)

    const data: Stock = {
      created_at: new Date(),
      token: "Não foi possível localizar o token",
      targetPrice: "Não foi possível localizar o preço alvo",
      recomendation: "Não foi possível localizar a recomendação",
      src: "Genial Investimentos",
      href: url,
      date: "Não foi possível localizar a data"
    }

    return data
  }
}