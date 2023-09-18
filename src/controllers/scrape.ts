import type { FastifyReply, FastifyRequest } from "fastify"
import puppeteer from "puppeteer"
import { get_safra_data } from "../components/safra"
import { get_data_inter } from "../components/inter"
import "dotenv/config"

interface getDataProps {
  token: string
}

export const data = {
  index: (req: FastifyRequest, res: FastifyReply) => {
    return res.view("index", { stocks: undefined })
  },

  get: async ( { body }: FastifyRequest<{ Body: getDataProps }>, res: FastifyReply ) => {
    const token = body.token.toLowerCase()

    console.log(token)

    const browser = await puppeteer.launch({
      headless: 'new',
      executablePath: "/usr/bin/chromium-browser",
      args: ["--no-sandbox", "--disable-gpu"]
    })

    const page = await browser.newPage()

    const safra_data = await get_safra_data(page, token)
    const inter_data = await get_data_inter(page, token)

    await page.close()
    await browser.close()

    return res.view("index", { stocks: [safra_data, inter_data] })
  },
}
