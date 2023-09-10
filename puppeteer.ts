import puppeteer from 'puppeteer'
require('dotenv').config()

export const getData = async (enterprise: string) => {
  const url = `https://www.safra.com.br/resultado-de-busca.htm?query=analise%20${enterprise}`
  // const browser = await puppeteer.launch({ args: [], executablePath: exePath, headless: true })
  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--disable-setuid-sandbox',
      '--no-sandbox',
      '--single-process',
      '--no-zygote',
    ],
    timeout: 0,
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH
  })
  const page = await browser.newPage()
  await page.goto(url, { waitUntil: 'load' })
  
  await Promise.all([
    page.$eval('div.s-col-12.resultados > div:nth-child(1) > a', 
      (element) => {
        console.log(element)
        element.click()
      }
    ),
    page.waitForNavigation({waitUntil: 'load'})
  ])
  
  const href = page.url()

  const {date, subtitle, title} = await Promise.all([
    page.$eval('h1.titulo', 
      (element) => {
        return element.textContent ?? ''
      }
    ),
    page.$eval('h2.sub', 
      (element) => {
        return element.textContent ?? ''
      }
    ),
    page.$eval('span.info', 
      (element) => {
        return element.textContent ?? ''
      }
    ),

  ]).then((value) => {
    return {
      title: value[0],
      subtitle: value[1],
      date: value[2]
    }
  })

  await page.close()
  await browser.close()

  return {
    token: getToken(title),
    targetPrice: getTargetPrice(subtitle),
    recomendation: getRecomedation(subtitle),
    src: 'Banco Safra',
    href,
    date
  }
}

const getRecomedation = (subTitle: string) => {
  const recomendations: string[] = ['neutra', 'compra', 'venda', 'revisão']

  for (const recomendation of recomendations) {
    if (subTitle.includes(recomendation)) {
      return recomendation
    }
  }

  return 'Não foi possível obter a recomendação'
}

const getToken = (phrase: string) => {
  for (const word of phrase.split(' ')) {
    if (/[A-ZÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ]{4}[0-9]/.test(word)) {
      const title = word.replace(':', '')
      return title
    }
  }

  return 'Não foi possível obter o token'
}

const getTargetPrice = (subTitle: string) => {
  for (const word of subTitle.split(' ')) {
    if (/[R]?[$]?[ ]?(\d{2}\,?\.?)+/.test(word)) {
      return word
    }
  }

  return 'Indeterminado'
}

