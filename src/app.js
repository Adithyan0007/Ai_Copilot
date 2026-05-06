import express from "express";
import cors from "cors";
import morgan from "morgan";
import errormiddleware from "./middlewares/error_middleware.js";
import registerRoutes from "./routes/register.js";
import loginRoutes from "./routes/login.js";
import documentRoutes from "./routes/documentroute.js";
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
app.use(errormiddleware);
export default app;
