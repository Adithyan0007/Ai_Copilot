import { prisma } from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const logincontroller = async (req, res) => {
  try {
    const { password } = req.body;
    const email = req.body.email?.trim().toLowerCase();
    console.log("hii");

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Credentials" });
    }

    const userDetails = await prisma.user.findUnique({
      where: { email },
    });

    if (!userDetails) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const rightpass = await bcrypt.compare(password, userDetails.password);
    if (!rightpass) {
      return res.status(400).json({ message: "Wrong Password" });
    }
    const token = jwt.sign(
      { userId: userDetails.id, email: userDetails.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );
    return res.status(201).json({
      success: true,
      message: "User Logged in Successfully",
      token,
    });
  } catch (err) {
    console.log(err);

    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export default logincontroller;
