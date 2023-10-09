import axios from "axios"
import { JSDOM } from "jsdom"
import { CambioSheet, CambioTable } from "../types"
import xlsx from "xlsx"

export const get_data_itau = async () => {
  const url = "https://www.itau.com.br/itaubba-pt/analises-economicas/projecoes"

  try {
    const res = await axios.get(url)
    const dom = new JSDOM(res.data).window.document

    const href: string = dom.querySelector("#csce364dd9e2f707f8 > div.carrossel-list > ul > li:nth-child(1) > div > div > div.link-block > a")?.getAttribute('href') ?? 'Não foi possível localizar a fonte'

    const {data: dataSheet} = await axios.request({
      responseType: 'arraybuffer',
      url: href,
      method: 'GET',
      headers: {
        'Content-Type': 'blob'
      }
    })
    
    const {SheetNames, Sheets} = xlsx.read(dataSheet)
    const worksheet = Sheets[SheetNames[0]]

    const years: any[] = []
    const cambios: any[] = []

    let date: string = ''

    for (let cell in worksheet) {
      const cellAsString = cell.toString()

      if (cellAsString === 'X1') {
        date = worksheet[cell].w
      }

      if ((/[a-zA-Z]{1}2{1}$/m).test(cellAsString)) {
        years.push(worksheet[cell].v.toString())
      }

      if (cellAsString.includes('40')) {
        cambios.push(worksheet[cell].v)
      }
    }

    let name: string = cambios[0]

    const data: CambioTable[] = []
    for (let i= 0; i < years.length; i++) {
      data.push({
        year: years[i],
        cambio: cambios[i+1].toFixed(2)
      })
    }

    const result: CambioSheet = {
      name,
      table: data,
      date: date ?? 'Não foi possível localizar a data',
      href,
      src: 'Itáu'
    }

    return result

  } catch (err) {
    console.error(err)

    const result: CambioSheet = {
      name: 'Não foi possível localizar o nome',
      table: [],
      date: 'Não foi possível localizar a data',
      href: url,
      src: 'economia em dia'
    }

    return result
  }
}