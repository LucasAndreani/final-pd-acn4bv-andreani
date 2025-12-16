import express from "express";
import bcrypt from "bcrypt";
import db from "../db.js";
import { createToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

function validateCredentials(req, res, next) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email y password son obligatorios" });
  }
  next();
}

router.post("/register", validateCredentials, async (req, res) => {
  const { email, password } = req.body;

  try {
    const exists = db
      .prepare("SELECT id FROM users WHERE email = ?")
      .get(email);

    if (exists) {
      return res.status(400).json({ error: "El email ya esta registrado" });
    }

    const hash = await bcrypt.hash(password, 10);

    const result = db
      .prepare(
        "INSERT INTO users (email, password_hash) VALUES (?, ?)"
      )
      .run(email, hash);

    const token = createToken({
      id: result.lastInsertRowid,
      email
    });

    res.status(201).json({ token, email });
  } catch (err) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

router.post("/login", validateCredentials, async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = db
      .prepare(
        "SELECT id, email, password_hash FROM users WHERE email = ?"
      )
      .get(email);

    if (!user) {
      return res.status(400).json({ error: "Credenciales invalidas" });
    }

    const match = await bcrypt.compare(password, user.password_hash);

    if (!match) {
      return res.status(400).json({ error: "Credenciales invalidas" });
    }

    const token = createToken({
      id: user.id,
      email: user.email
    });

    res.json({ token, email: user.email });
  } catch (err) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

export default router;
