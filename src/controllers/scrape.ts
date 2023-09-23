import type { FastifyReply, FastifyRequest } from "fastify"
import puppeteer from "puppeteer"
import { get_safra_data } from "../components/safra"
import { get_data_inter } from "../components/inter"
import { get_data_xp } from "../components/xp"
import { get_data_btg } from "../components/btg"
import { get_data_genial } from "../components/genial"
import { getToken, setToken } from "utils/firebase"
// import "dotenv/config"

interface getDataProps {
  token: string
}

export const data = {
  index: (req: FastifyRequest, res: FastifyReply) => {
    return res.view("index", { stocks: undefined })
  },

  get: async ({ body }: FastifyRequest<{ Body: getDataProps }>, res: FastifyReply) => {
    const token = body.token.toLowerCase()

    console.log(token)

    const browser = await puppeteer.launch({
      ignoreHTTPSErrors: true,
      headless: true,
      // executablePath: "/usr/bin/chromium-browser",
      args: ["--no-sandbox", "--disable-gpu", '--disable-web-security', '--ignore-certificate-errors']
    })

    const page = await browser.newPage()


    // const { btg_data, xp_data } = await Promise.all([
    //   get_data_btg(page, token),
    //   get_data_xp(token)
    // ]).then(
    //   (value) => {
    //     return {
    //       btg_data: value[0],
    //       xp_data: value[1],
    //     }
    //   }
    // )
    await getToken(token, 'btg').then((v) => console.log(v))
    const xp_data = await getToken(token, 'xp') ?? await get_data_xp(token);
    const btg_data = await getToken(token, 'btg') ?? await get_data_btg(page, token)
    const safra_data = await getToken(token, 'safra') ?? await get_safra_data(page, token)
    const inter_data = await getToken(token, 'inter') ?? await get_data_inter(page, token)
    // const genial_data = await getToken(token, 'genial') ?? await get_data_genial(page, token)

    await page.close()
    await browser.close()

    return res.view("index", { stocks: [safra_data, inter_data, xp_data, btg_data /*, genial_data*/] })
  },
}
