import { CronJob } from "cron"

export const cron = {
  startRender: () => {
    const job = new CronJob('0 0/10 * 1/1 * *', () => console.log('Hello World!!'))

    job.start()
  }
}