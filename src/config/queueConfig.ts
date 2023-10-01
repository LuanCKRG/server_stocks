import { QueueOptions } from "bullmq"
import { env } from "../env"

export const queueConfig: QueueOptions = {
  connection: {
    host: env.QUEUE_HOST,
    port: env.QUEUE_PORT,
  }
}