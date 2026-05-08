import { prisma } from "../db.js";
import {
  generateEmbedding,
  generateAnswer,
} from "../services/gemini.service.js";
import { cosineSimilarity } from "../utils/cosinesimilarity.js";

const chatController = async (req, res) => {
  const { userId } = req.user;
  const { query } = req.body || {};
  if (!query || query == "") {
    return res.status(400).json({ message: "Query is required" });
  }
  const documents = await prisma.document.findMany({
    where: {
      userId: userId,
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
  let results = [];
  const queryEmbedding = await generateEmbedding(query);

  for (let i = 0; i < documents.length; i++) {
    for (let j = 0; j < documents[i].chunks.length; j++) {
      let similarity = cosineSimilarity(
        queryEmbedding,
        documents[i]["chunks"][j]["embedding"],
      );
      results.push({
        id: documents[i].chunks[j]["id"],
        similarity: similarity,
        content: documents[i].chunks[j]["content"],
      });
    }
  }
  console.log(results);

  let topResults = results
    .sort((a, b) => b["similarity"] - a["similarity"])
    .slice(0, 5);

  if (!topResults.length || topResults[0].similarity < 0.7) {
    return res.status(200).json({
      success: true,
      message: "No relevant information found in your documents",
      answer: null,
      sources: [],
    });
  }
  const context = await top
    .slice(0, 5)
    .map((val, index) => {
      `Source ${index + 1}: ${val.title}\n${val.content}`;
    })
    .join("\n\n");
  const prompt = `
You are an AI assistant. Answer the user's question only using the given context.

Context:
${context}

Question:
${query}

If the answer is not available in the context, say:
"I could not find this information in your uploaded documents."
`;

  const answer = await generateAnswer(prompt);

  return res.status(200).json({
    success: true,
    answer,
    sources: topResults.map((item) => ({
      chunkId: item.id,
      title: item.title,
      similarity: item.similarity,
    })),
  });
};
export default chatController;
