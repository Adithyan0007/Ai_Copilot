import { Worker } from "bullmq";
import { prisma } from "../db.js";
import { generateEmbedding } from "../services/gemini.service.js";
import { PDFParse } from "pdf-parse";
import fs from "fs";
import overlapChunking from "../utils/chunking.js";
const worker = new Worker(
  "document",
  async (job) => {
    try {
      const { documentId, content } = job.data;
      const buffer = fs.readFileSync(content);
      const parser = new PDFParse({ data: buffer });

      const result = await parser.getText();
      const text = result.text;
      const chunks = overlapChunking(text);

      const embeddings = await Promise.all(
        chunks.map((chunk) => generateEmbedding(chunk)),
      );
      for (let i = 0; i < chunks.length; i++) {
        const embeddingString = `[${embeddings[i].join(",")}]`;
        await prisma.$executeRaw`
    INSERT INTO "DocumentChunk" 
    ("content", "documentId", "embedding", "index")
    VALUES 
    (${chunks[i]}, ${documentId}, ${embeddingString}::vector, ${i})
  `;
      }

      const document = await prisma.document.update({
        where: {
          id: documentId,
        },
        data: {
          content: text,
          status: "completed",
        },
      });

      console.log("Chunks created:", chunks.length);
    } catch (err) {
      console.log("Worker error:", err);
      console.log("Worker error:", err);

      if (job.attemptsMade + 1 >= job.opts.attempts) {
        await prisma.document.update({
          where: { id: job.data.documentId },
          data: { status: "failed" },
        });
      }

      throw err;
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
