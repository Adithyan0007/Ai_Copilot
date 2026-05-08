import { prisma } from "../db.js";
import { generateEmbedding } from "../services/gemini.service.js";
import { cosineSimilarity } from "../utils/cosinesimilarity.js";
const searchController = async (req, res) => {
  const { userId } = req.user;

  const { query } = req.body || {};

  if (!query || query == "") {
    return res.status(400).json({ message: "Query is required" });
  }
  console.log(userId);
  const documents = await prisma.document.findMany({
    where: {
      userId,
    },
    select: {
      title: true,
      chunks: {
        select: {
          documentId: true,
          id: true,
          content: true,
          embedding: true,
        },
      },
    },
  });

  const embedding = await generateEmbedding(query);
  const results = [];
  for (let i = 0; i < documents.length; i++) {
    for (let j = 0; j < documents[i].chunks.length; j++) {
      const cosineSimilarityScore = cosineSimilarity(
        embedding,
        documents[i].chunks[j].embedding,
      );

      results.push({
        score: cosineSimilarityScore,
        id: documents[i].chunks[j].id,
        content: documents[i].chunks[j].content,
        title: documents[i].title,
      });
    }
  }
  const top = results.sort((a, b) => b["score"] - a["score"]);
  let queryResult = top.slice(0, 5);
  if (queryResult[0].score < 0.7) {
    return res.status(201).json({
      success: true,
      Message: "No Relevant results",
    });
  }
  return res.status(201).json({
    success: true,
    data: queryResult,
  });
};
export default searchController;
