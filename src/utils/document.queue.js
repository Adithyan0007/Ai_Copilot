import { Queue } from "bullmq";
export const documentQueue = new Queue("document", {
  connection: {
    host: "127.0.0.1",
    port: 6379,
  },
});
