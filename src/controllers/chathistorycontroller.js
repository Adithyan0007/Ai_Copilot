import { prisma } from "../db.js";

const chatHistoryController = async (req, res) => {
  try {
    const { userId } = req.user;

    const data = await prisma.message.findMany({
      where: {
        userId,
      },
      select: {
        id: true,
        question: true,
        answer: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      history: data,
    });
  } catch (err) {
    console.log("Chat history error:", err);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export default chatHistoryController;
