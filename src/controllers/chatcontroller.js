import { prisma } from "../db.js";
import {
  generateEmbedding,
  generateAnswer,
} from "../services/gemini.service.js";
import { cosineSimilarity } from "../utils/cosinesimilarity.js";
import { redis } from "../utils/redis_caching.js";

const chatController = async (req, res) => {
  try {
    const { userId } = req.user;
    const { query } = req.body || {};

    if (!query || query.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Query is required",
      });
    }

    const cacheKey = `chat:${userId}:${query.toLowerCase().trim()}`;

    const cachedAnswer = await redis.get(cacheKey);

    if (cachedAnswer) {
      return res.status(200).json({
        success: true,
        cached: true,
        ...JSON.parse(cachedAnswer),
      });
    }

    const queryEmbedding = await generateEmbedding(query);
    const queryVector = `[${queryEmbedding.join(",")}]`;
    const data =
      await prisma.$queryRaw`select dc.id,dc.content,dc.index,dc."documentId",dc.embedding <=> ${queryVector}::vector AS distance from "DocumentChunk" dc join
    "Document" d on d.id=dc."documentId" where d."userId"=${userId} ORDER BY distance LIMIT 5`;
    if (data?.length < 1 || 1 - data[0]?.distance < 0.7) {
      return res.status(200).json({
        success: true,
        cached: false,
        message: "No relevant information found in your documents",
        answer: null,
        sources: [],
      });
    }

    const context = data
      .map(
        (item, index) => `DOCUMENT CHUNK ${index + 1}:
${item.content}`,
      )
      .join("\n");

    const prompt = `
Answer the user's question ONLY using the provided document chunks and maximum 200 words.

If the answer is not found in the document context, say:
"I could not find this information in your uploaded documents."

Do not use outside/general knowledge.

DOCUMENT CONTEXT:
${context}

USER QUESTION:
${query}

ANSWER:
`;

    const answer = await generateAnswer(prompt);

    await prisma.message.create({
      data: {
        userId,
        query,
        answer,
      },
    });

    const responseData = {
      answer,
      sources: data.map((item) => ({
        chunkId: item.id,
        title: item.title,
        similarity: 1 - item.distance,
        content: item.content,
      })),
    };

    await redis.set(cacheKey, JSON.stringify(responseData), "EX", 60 * 10);

    return res.status(200).json({
      success: true,
      cached: false,
      ...responseData,
    });
  } catch (error) {
    console.error("Chat controller error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while generating answer",
    });
  }
};

export default chatController;
