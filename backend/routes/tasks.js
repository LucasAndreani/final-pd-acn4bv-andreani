import express from "express";
import db from "../db.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

function validateTask(req, res, next) {
  if (!req.body.title || req.body.title.trim() === "") {
    return res.status(400).json({ error: "El campo 'title' es obligatorio" });
  }
  next();
}

router.get("/", authMiddleware, (req, res) => {
  try {
    const rows = db
      .prepare(
        "SELECT id, title FROM tasks WHERE user_id = ? ORDER BY id DESC"
      )
      .all(req.user.id);

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

router.get("/:id", authMiddleware, (req, res) => {
  const id = Number(req.params.id);

  try {
    const task = db
      .prepare(
        "SELECT id, title FROM tasks WHERE id = ? AND user_id = ?"
      )
      .get(id, req.user.id);

    if (!task) {
      return res.status(404).json({ error: "Task no encontrada" });
    }

    res.json(task);
  } catch (err) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

router.post("/", authMiddleware, validateTask, (req, res) => {
  try {
    const title = req.body.title.trim();

    const result = db
      .prepare(
        "INSERT INTO tasks (title, user_id) VALUES (?, ?)"
      )
      .run(title, req.user.id);

    res.status(201).json({
      id: result.lastInsertRowid,
      title
    });
  } catch (err) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

router.put("/:id", authMiddleware, validateTask, (req, res) => {
  const id = Number(req.params.id);
  const title = req.body.title.trim();

  try {
    const exists = db
      .prepare(
        "SELECT id FROM tasks WHERE id = ? AND user_id = ?"
      )
      .get(id, req.user.id);

    if (!exists) {
      return res.status(404).json({ error: "Task no encontrada" });
    }

    db.prepare(
      "UPDATE tasks SET title = ? WHERE id = ? AND user_id = ?"
    ).run(title, id, req.user.id);

    res.json({ id, title });
  } catch (err) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

router.delete("/:id", authMiddleware, (req, res) => {
  const id = Number(req.params.id);

  try {
    const exists = db
      .prepare(
        "SELECT id FROM tasks WHERE id = ? AND user_id = ?"
      )
      .get(id, req.user.id);

    if (!exists) {
      return res.status(404).json({ error: "Task no encontrada" });
    }

    db.prepare(
      "DELETE FROM tasks WHERE id = ? AND user_id = ?"
    ).run(id, req.user.id);

    res.json({ message: "Task eliminada correctamente" });
  } catch (err) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

export default router;
