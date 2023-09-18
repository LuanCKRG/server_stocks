import { Page } from "puppeteer"

export const get_data_inter = async (page: Page, search: string) => {
  const url = 'https://interinvest.inter.co/acoes'

  try {
    await page.goto(url, { waitUntil: 'domcontentloaded' })

    const input = await page.waitForSelector("input[placeholder='Buscar por ativos']")
    await input?.type(search)
    await input?.dispose()

    const token =  await Promise.all([
      page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
      page.$$eval('div.container >  div:nth-child(2) > div:nth-child(2).row > div.col-12.col-md-6.mb-4',
        (element, search) => {

          for (const div of element) {
            const token_from_scrape = div.querySelector('div > div.d-flex.align-stocks-center > div:nth-child(2) > h3')?.textContent?.trim() ?? ''

            if (search === token_from_scrape.toLowerCase()) {
              // const tar = div.querySelectorAll('div > div.row.mb-3 > div:nth-child(1).col-6.mb-3 > div > div.ml-2 > span:nth-child(2)')
              const anchor: HTMLAnchorElement | null = div.querySelector('div > div.d-flex.align-center.justify-content-end > a:nth-child(2)')
              anchor?.click()
              return token_from_scrape
            }
          }
        }, search
      )
    ]).then((value) => value[1])

    const { recomendation, targetPrice } = await page.$$eval('div.row > div.col-12.col-md-4.col-lg-12.order-md-last.mb-4 > div:nth-child(1) >  div > span',
      (elements) => {
        const result = { recomendation: elements[0].textContent?.toLowerCase(), targetPrice: elements[2].textContent }

        return result
      }
    )

    const href = page.url()

    const data = {
      token: token ?? 'Não foi possível localizar o token',
      targetPrice: targetPrice ?? 'Não foi possível localizar o preço alvo',
      recomendation: recomendation ?? 'Não foi possível localizar a recomendação',
      src: "Inter Invest",
      href,
      date: 'Não fornecido por Inter Invest',

    }

    return data

  } catch (err) {
    console.error(err)

    const data = {
      token: 'Não foi possível localizar o token',
      targetPrice: 'Não foi possível localizar o preço alvo',
      recomendation: 'Não foi possível localizar a recomendação',
      src: "Inter Invest",
      href: url,
      date: 'Não foi possível localizar a data',
    }

    return data
  }
}