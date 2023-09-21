import { Page } from "puppeteer"

export const get_data_btg = async (page: Page, search: string) => {
  const url = `https://content.btgpactual.com/research/home/acoes/ativo/${search.toUpperCase()}`

  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60 * 1000 })


    // const {} = await Promise.all([

    // ])
    const {token, targetPrice, recomendation} = await page.$eval('body > app-root > app-equities > app-asset-details > section:nth-child(1) > div > div.cell-4-phone.cell-8-tablet.cell-12-desktop > app-card-asset > div',
      (element) => {
        const token = element.querySelector("div.profile-asset > div > div")?.textContent ?? 'Não foi possível localizar o token'
        const targetPrice = element.querySelector("div.metrics > div > div.target-price.ng-star-inserted > div.target-price-present")?.textContent ?? 'Não foi possível localizar o preço-alvo'
        const recomendation = element.querySelector("div.buy.ng-star-inserted > div:nth-child(1)")?.textContent ?? 'Não foi possível localizar a recomendação'

        return { token, targetPrice, recomendation}
      }
    ).catch(
      () => {
        throw new Error('Not found page on BTG pactual')
      }
    )

    const data = {
      token: token.toUpperCase(),
      targetPrice: targetPrice,
      recomendation: recomendation,
      src: "BTG pactual",
      href: url,
      date: 'Não fornecido por BTG Pactual',
    }

    console.log('BTG sucessed!!')
    return data

  } catch (err) {
    console.error(err)

    const data = {
      token: "Não foi possível localizar o token",
      targetPrice: "Não foi possível localizar o preço alvo",
      recomendation: "Não foi possível localizar a recomendação",
      src: "BTG Pactual",
      href: url,
      date: "Não foi possível localizar a data",
    }

    return data
  }
}