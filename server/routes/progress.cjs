const express = require("express");
const { v4: uuidv4 } = require("uuid");
const { getDb } = require("../db.cjs");
const { authMiddleware } = require("../middleware/auth.cjs");

const router = express.Router();

router.use(authMiddleware);

router.get("/", (req, res) => {
  const db = getDb();
  const { game } = req.query;

  let rows;
  if (game) {
    rows = db
      .prepare("SELECT * FROM progress WHERE user_id = ? AND game = ?")
      .all(req.user.id, game);
  } else {
    rows = db
      .prepare("SELECT * FROM progress WHERE user_id = ?")
      .all(req.user.id);
  }

  const progress = {};
  for (const row of rows) {
    progress[`${row.game}:${row.category}:${row.item_id}`] = row.checked === 1;
  }

  res.json({ progress });
});

router.post("/toggle", (req, res) => {
  const { game, category, itemId, checked } = req.body;

  if (!game || !category || !itemId) {
    return res.status(400).json({ error: "game, category e itemId são obrigatórios" });
  }

  const db = getDb();
  const existing = db
    .prepare("SELECT id FROM progress WHERE user_id = ? AND game = ? AND category = ? AND item_id = ?")
    .get(req.user.id, game, category, itemId);

  if (existing) {
    db.prepare("UPDATE progress SET checked = ?, updated_at = datetime('now') WHERE id = ?")
      .run(checked ? 1 : 0, existing.id);
  } else {
    db.prepare(
      "INSERT INTO progress (id, user_id, game, category, item_id, checked) VALUES (?, ?, ?, ?, ?, ?)"
    ).run(uuidv4(), req.user.id, game, category, itemId, checked ? 1 : 0);
  }

  const key = `${game}:${category}:${itemId}`;
  res.json({ success: true, [key]: !!checked });
});

router.post("/batch", (req, res) => {
  const { items } = req.body;

  if (!Array.isArray(items)) {
    return res.status(400).json({ error: "items deve ser um array" });
  }

  const db = getDb();
  const upsert = db.prepare(
    `INSERT INTO progress (id, user_id, game, category, item_id, checked)
     VALUES (?, ?, ?, ?, ?, ?)
     ON CONFLICT(user_id, game, category, item_id)
     DO UPDATE SET checked = excluded.checked, updated_at = datetime('now')`
  );

  const insertMany = db.transaction((items) => {
    for (const item of items) {
      upsert.run(uuidv4(), req.user.id, item.game, item.category, item.itemId, item.checked ? 1 : 0);
    }
  });

  insertMany(items);

  res.json({ success: true, count: items.length });
});

router.delete("/", (req, res) => {
  const db = getDb();
  const { game } = req.query;

  if (game) {
    db.prepare("DELETE FROM progress WHERE user_id = ? AND game = ?").run(req.user.id, game);
  } else {
    db.prepare("DELETE FROM progress WHERE user_id = ?").run(req.user.id);
  }

  res.json({ success: true });
});

module.exports = router;

