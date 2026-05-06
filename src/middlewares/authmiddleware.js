import jwt from "jsonwebtoken";
const authMiddleWare = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token)
    return res
      .status(400)
      .json({ success: false, message: "User not authenticated" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};
export default authMiddleWare;
