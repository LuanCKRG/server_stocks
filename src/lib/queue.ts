import { Queue, Worker } from "bullmq"
import { get_data_btg } from "../components/btg"
import { get_data_inter } from "../components/inter"
import { get_safra_data } from "../components/safra"
import { get_data_xp } from "../components/xp"
import { puppeteerConfig } from "../config/puppeteerConfig"
import { queueConfig } from "../config/queueConfig"
import puppeteer from "puppeteer"

export const queue = {
  add: (stock: string) => {
    const StockQueue = new Queue('stock', queueConfig)

    StockQueue.add('stock', stock)
  }
}


const StockWorker = new Worker('stock',
  async (job) => {
    const {data: token} = job

    console.log(token)

    const browser = await puppeteer.launch(puppeteerConfig)
    const page = await browser.newPage()
    
    await get_data_xp(token)
    await get_safra_data(page, token)
    await get_data_inter(page, token)
    await get_data_btg(page, token)

    await page.close()
    await browser.close()

    return {dataProcessed: true}
  }, queueConfig
)

StockWorker.on('completed',
  (job) => {
    console.log(job.data, 'atualizado com sucesso')
  }
)

StockWorker.on('failed',
  (job, error) => {
    console.log('Algo deu errado')
    console.error(error)
  }
)
