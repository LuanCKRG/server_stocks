import axios from "axios"
import { JSDOM } from 'jsdom'
import { getTargetPrice } from "../utils/stocks"
import { Firebase } from "../lib/firebase"
import { Stock } from "types"

export const get_data_xp = async (search: string) => {
  const url = `https://conteudos.xpi.com.br/acoes/${search.toLowerCase()}`

  try {
    const res = await axios.get(url)
    const dom = new JSDOM(res.data)

    const targetPrice = getTargetPrice(dom.window.document.querySelector('#main > div:nth-child(3) > ul > li:nth-child(2)')?.textContent ?? '')
    const recomendation = dom.window.document.querySelector('#main > div:nth-child(3) > ul > li:nth-child(5) > span.recomendacao')?.textContent ?? ''
    const date = dom.window.document.querySelector('#main > div:nth-child(3) > div.row.py-4.my-2.top-bordered > div.col-7.text-right > div > p')?.textContent ?? ''

    const data: Stock = {
      created_at: new Date(),
      token: search.toUpperCase(),
      targetPrice: targetPrice,
      recomendation: recomendation,
      src: "XP",
      href: url,
      date: date,
      org: 'xp'
    }

    console.log('XP sucessed!!')

    Firebase.setStock(data)

    return data

  } catch (err) {
    console.error(new Error('Not found page on XP'))

    const data: Stock = {
      created_at: new Date(),
      token: "Não foi possível localizar o token",
      targetPrice: "Não foi possível localizar o preço alvo",
      recomendation: "Não foi possível localizar a recomendação",
      src: "XP",
      href: url,
      date: "Não foi possível localizar a data",
      org: 'xp'
    }

    return data
  }

}