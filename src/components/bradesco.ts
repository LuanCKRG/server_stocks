import axios from "axios"
import {JSDOM} from 'jsdom'
import { Firebase } from "../lib/firebase"
import { BradescoOpinion, BradescoTable } from "../types"
import { getDate } from "../utils/stocks"

export const get_data_bradesco = async () => {
  const url = 'https://www.economiaemdia.com.br/SiteEconomiaEmDia/Projecoes/Longo-Prazo'

  try {
    const res = await axios.get(url)
    const dom = new JSDOM(res.data).window.document

    const date = dom.querySelector("#colRight > div > div:nth-child(2) > div:nth-child(1) > p:nth-child(1)")?.textContent ?? 'Não foi possível localizar a data'

    const years: string[] = []
    for (const year of dom.querySelectorAll("#Longo_mascara_30528 > table > tbody > tr:nth-child(1) > td")) {
      const value = year.textContent ?? ""

      if(value !== ""){
        years.push(value)
      }
    }

    const cambio: string[] = []
    let name: string = 'Não foi possível encontrar o nome'
    for (const div of dom.querySelectorAll("#Longo_mascara_30528 > table > tbody > tr:nth-child(25) > td")) {
      const value = div.textContent ?? ""

      if (value !== ""  && !(/[a-zA-ZÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ]/.test(value))) {
        cambio.push(value)
      } else {
        name = value
      }
    }

    const data: BradescoTable[] = []

    for (let i = 0; i < years.length; i++) {
      data.push({
        year: years[i],
        cambio: cambio[i]
      })
    }

    const result: BradescoOpinion = {
      name,
      table: data,
      date: getDate(date) ?? 'Não foi possível localizar a data',
      href: url,
      src: 'Economia em dia'
    }

    Firebase.setBradesco(result)

    return result

  } catch (err) {
    console.error(err)

    const result: BradescoOpinion = {
      name: 'Não foi possível localizar o nome',
      table: [],
      date: 'Não foi possível localizar a data',
      href: url,
      src: 'economia em dia'

    }

    return result
  }
}

