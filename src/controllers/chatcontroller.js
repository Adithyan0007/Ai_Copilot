import { prisma } from "../db.js";
import {
  generateEmbedding,
  generateAnswer,
} from "../services/gemini.service.js";
import { cosineSimilarity } from "../utils/cosinesimilarity.js";
import { redis } from "../utils/redis_caching.js";

const chatController = async (req, res) => {
  try {
    console.log(req.body);

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

    const documents = await prisma.document.findMany({
      where: {
        userId,
      },
      select: {
        title: true,
        chunks: {
          select: {
            id: true,
            content: true,
            embedding: true,
          },
        },
      },
    });

    if (!documents.length) {
      return res.status(200).json({
        success: true,
        message: "No documents uploaded yet",
        answer: null,
        sources: [],
      });
    }

    const queryEmbedding = await generateEmbedding(query);

    let results = [];

    for (const document of documents) {
      for (const chunk of document.chunks) {
        let chunkEmbedding = chunk.embedding;

        if (typeof chunkEmbedding === "string") {
          chunkEmbedding = JSON.parse(chunkEmbedding);
        }

        if (!Array.isArray(chunkEmbedding)) continue;

        const similarity = cosineSimilarity(queryEmbedding, chunkEmbedding);

        results.push({
          id: chunk.id,
          title: document.title,
          similarity,
          content: chunk.content,
        });
      }
    }

    const topResults = results
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 5);

    if (!topResults.length || topResults[0].similarity < 0.7) {
      return res.status(200).json({
        success: true,
        message: "No relevant information found in your documents",
        answer: null,
        sources: [],
      });
    }

    const context = topResults
      .map(
        (item, index) => `DOCUMENT CHUNK ${index + 1}:
${item.content}`,
      )
      .join("\n\n");

    const prompt = `
Answer the user's question ONLY using the provided document chunks.

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
      sources: topResults.map((item) => ({
        chunkId: item.id,
        title: item.title,
        similarity: item.similarity,
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
