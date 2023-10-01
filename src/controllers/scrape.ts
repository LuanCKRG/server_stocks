import type { FastifyReply, FastifyRequest } from "fastify"
import puppeteer from "puppeteer"
import { get_safra_data } from "../components/safra"
import { get_data_inter } from "../components/inter"
import { get_data_xp } from "../components/xp"
import { get_data_btg } from "../components/btg"
import { Firebase } from "../lib/firebase"
import { puppeteerConfig } from "../config/puppeteerConfig"
import { queue } from "../lib/queue"

interface BodyGetDataProps {
  token: string
}

export const data = {
  index: (req: FastifyRequest, res: FastifyReply) => {
    return res.view("index", { stocks: undefined })
  },

  get: async ({ body }: FastifyRequest<{ Body: BodyGetDataProps }>, res: FastifyReply) => {
    const token = body.token.toLowerCase()

    console.log(token)

    const browser = await puppeteer.launch(puppeteerConfig)
    const page = await browser.newPage()
    
    const xp_data = await Firebase.getStock(token, 'xp') ?? await get_data_xp(token)
    const safra_data = await Firebase.getStock(token, 'safra') ?? await get_safra_data(page, token)
    const inter_data = await Firebase.getStock(token, 'inter') ?? await get_data_inter(page, token)
    const btg_data = await Firebase.getStock(token, 'btg') ?? await get_data_btg(page, token)

    queue.add(token)

    await page.close()
    await browser.close()

    return res.view("index", { stocks: [safra_data, inter_data, xp_data, btg_data /*, genial_data*/] })
  },
}