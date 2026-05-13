import { Worker } from "bullmq";
import { prisma } from "../db.js";
import { generateEmbedding } from "../services/gemini.service.js";
const worker = new Worker(
  "document",
  async (job) => {
    try {
      const { documentId, content } = job.data;

      const chunks = content
        .split("\n\n")
        .map((chunk) => chunk.trim())
        .filter(Boolean);
      const embeddings = await Promise.all(
        chunks.map((chunk) => generateEmbedding(chunk)),
      );

      const chunkData = chunks.map((val, i) => ({
        content: val,
        documentId,
        embedding: embeddings[i],
      }));

      const resultchunks = await prisma.documentChunk.createMany({
        data: chunkData,
      });

      console.log("Chunks created:", chunks.length);
      console.log("DB result:", resultchunks);
    } catch (err) {
      console.log("Worker error:", err);
    }
  },
  {
    connection: {
      host: process.env.REDIS_HOST || "127.0.0.1",
      port: Number(process.env.REDIS_PORT) || 6379,
    },
  },
);

worker.on("failed", (job, err) => {
  console.log("Job failed:", err);
});

console.log("Document worker running...");
