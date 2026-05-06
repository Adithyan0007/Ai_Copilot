import { prisma } from "../db.js";
import bcrypt from "bcrypt";
import isValidEmail from "../utils/emailvaliditycheck.js";

const registerController = async (req, res) => {
  try {
    const { password, name } = req.body;
    const email = req.body.email?.trim().toLowerCase();

    if (!email || !password || !name) {
      return res
        .status(400)
        .json({ success: false, message: "Incomplete Details" });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ success: false, message: "Invalid Email" });
    }

    const emailExist = await prisma.user.findUnique({
      where: { email },
    });

    if (emailExist) {
      return res
        .status(400)
        .json({ success: false, message: "Email Already Exists" });
    }

    const hashedpass = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedpass,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    return res.status(201).json({
      success: true,
      message: "User Created Successfully",
      data: user,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export default registerController;
