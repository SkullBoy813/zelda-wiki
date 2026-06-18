const express = require("express");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const { getDb } = require("../db.cjs");
const { generateToken, authMiddleware } = require("../middleware/auth.cjs");

const router = express.Router();

router.post("/register", (req, res) => {
  const { email, username, password } = req.body;

  if (!email || !username || !password) {
    return res.status(400).json({ error: "Email, usuário e senha são obrigatórios" });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: "Senha deve ter no mínimo 6 caracteres" });
  }

  const db = getDb();

  const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
  if (existing) {
    return res.status(409).json({ error: "Email já cadastrado" });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  const id = uuidv4();

  db.prepare(
    "INSERT INTO users (id, email, username, password) VALUES (?, ?, ?, ?)"
  ).run(id, email, username, hashedPassword);

  const token = generateToken({ id, email, username });

  res.status(201).json({
    token,
    user: { id, email, username },
  });
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email e senha são obrigatórios" });
  }

  const db = getDb();
  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);

  if (!user) {
    return res.status(401).json({ error: "Email ou senha inválidos" });
  }

  const valid = bcrypt.compareSync(password, user.password);
  if (!valid) {
    return res.status(401).json({ error: "Email ou senha inválidos" });
  }

  const token = generateToken({ id: user.id, email: user.email, username: user.username });

  res.json({
    token,
    user: { id: user.id, email: user.email, username: user.username },
  });
});

router.get("/me", authMiddleware, (req, res) => {
  const db = getDb();
  const user = db.prepare("SELECT id, email, username, avatar, created_at FROM users WHERE id = ?").get(req.user.id);

  if (!user) {
    return res.status(404).json({ error: "Usuário não encontrado" });
  }

  res.json({ user });
});

module.exports = router;

