import express from "express";
import cors from "cors";
import morgan from "morgan";
import errormiddleware from "./middlewares/error_middleware.js";
import registerRoutes from "./routes/register.js";
import loginRoutes from "./routes/login.js";
import documentRoutes from "./routes/documentroute.js";
import searchQuery from "./routes/searchroute.js";
import chatQuery from "./routes/chatroute.js";
import { rateLimit } from "express-rate-limit";
const ailimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window`
  standardHeaders: "draft-8", // RateLimit-Limit/Remaining/Reset headers
  legacyHeaders: false, // Disable X-RateLimit-* headers
  message: "Too many requests, please try again later.",
});
const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", async (req, res) => {
  res.status(200).json({
    success: true,
    message: "server running properly",
  });
});
app.use("/register", registerRoutes);
app.use("/login", loginRoutes);
app.use("/document", documentRoutes);
app.use("/search", ailimiter, searchQuery);
app.use("/chat", chatQuery);

app.use(errormiddleware);
export default app;
