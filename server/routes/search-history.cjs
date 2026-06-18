const express = require("express");
const { v4: uuidv4 } = require("uuid");
const { getDb } = require("../db.cjs");
const { authMiddleware } = require("../middleware/auth.cjs");

const router = express.Router();

router.use(authMiddleware);

router.get("/", (req, res) => {
  const db = getDb();
  const rows = db
    .prepare("SELECT * FROM search_history WHERE user_id = ? ORDER BY created_at DESC LIMIT 20")
    .all(req.user.id);

  res.json({ history: rows });
});

router.post("/", (req, res) => {
  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ error: "query é obrigatório" });
  }

  const db = getDb();
  db.prepare("INSERT INTO search_history (id, user_id, query) VALUES (?, ?, ?)")
    .run(uuidv4(), req.user.id, query);

  res.status(201).json({ success: true });
});

router.delete("/", (req, res) => {
  const db = getDb();
  db.prepare("DELETE FROM search_history WHERE user_id = ?").run(req.user.id);

  res.json({ success: true });
});

module.exports = router;

