import { env } from "../env"
import { PuppeteerLaunchOptions } from "puppeteer"

export const puppeteerConfig: PuppeteerLaunchOptions = {
  ignoreHTTPSErrors: true,
  headless: true,
  executablePath: env.NODE_ENV ===  "dev" ? undefined : "/usr/bin/chromium-browser",
  args: ["--no-sandbox", "--disable-gpu", '--disable-web-security', '--ignore-certificate-errors']
}