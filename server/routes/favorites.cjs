const express = require("express");
const { v4: uuidv4 } = require("uuid");
const { getDb } = require("../db.cjs");
const { authMiddleware } = require("../middleware/auth.cjs");

const router = express.Router();

router.use(authMiddleware);

router.get("/", (req, res) => {
  const db = getDb();
  const rows = db
    .prepare("SELECT * FROM favorites WHERE user_id = ? ORDER BY created_at DESC")
    .all(req.user.id);

  res.json({ favorites: rows });
});

router.post("/add", (req, res) => {
  const { game, entityType, entityId, entityName } = req.body;

  if (!game || !entityType || !entityId || !entityName) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios" });
  }

  const db = getDb();
  const existing = db
    .prepare("SELECT id FROM favorites WHERE user_id = ? AND entity_type = ? AND entity_id = ?")
    .get(req.user.id, entityType, entityId);

  if (existing) {
    return res.status(409).json({ error: "Item já está nos favoritos" });
  }

  db.prepare(
    "INSERT INTO favorites (id, user_id, game, entity_type, entity_id, entity_name) VALUES (?, ?, ?, ?, ?, ?)"
  ).run(uuidv4(), req.user.id, game, entityType, entityId, entityName);

  res.status(201).json({ success: true });
});

router.delete("/:entityType/:entityId", (req, res) => {
  const { entityType, entityId } = req.params;

  const db = getDb();
  db.prepare("DELETE FROM favorites WHERE user_id = ? AND entity_type = ? AND entity_id = ?")
    .run(req.user.id, entityType, entityId);

  res.json({ success: true });
});

module.exports = router;

