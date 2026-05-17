import { prisma } from "../db.js";
import { documentQueue } from "../utils/document.queue.js";

const createDocument = async (req, res) => {
  const { userId } = req.user;

  const title = req.body.title;
  const content = req.file;

  if (!title || !content)
    return res.status(400).json({ message: "Content not complete" });

  try {
    const document = await prisma.document.create({
      data: {
        title,
        content: content.path,
        userId,
      },
      select: {
        id: true,
        title: true,
      },
    });

    await documentQueue.add(
      "chunk-document",
      {
        documentId: document.id,
        content: content.path,
      },
      {
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 5000,
        },
        removeOnComplete: true,
        removeOnFail: false,
      },
    );

    return res.status(201).json({
      success: true,
      message: "Document Created Successfully",
      data: document,
    });
  } catch (err) {
    console.log(err);

    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
const getDocuments = async (req, res) => {
  try {
    const docs = await prisma.document.findMany({
      where: { userId: req.user.userId },
      select: { id: true, title: true },
      orderBy: { createdAt: "desc" },
    });

    res.json(docs);
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
export { createDocument, getDocuments };
