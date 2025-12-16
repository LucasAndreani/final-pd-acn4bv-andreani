import "dotenv/config";
import express from "express";
import cors from "cors";
import tasksRouter from "./routes/tasks.js";
import authRouter from "./routes/auth.js";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.get("/", (req, res) => {
  res.json({ message: "Servidor funcionando" });
});

app.use("/auth", authRouter);
app.use("/tasks", tasksRouter);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
