const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const authRoutes = require("./routes/auth.cjs");
const progressRoutes = require("./routes/progress.cjs");
const favoritesRoutes = require("./routes/favorites.cjs");
const searchHistoryRoutes = require("./routes/search-history.cjs");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/favorites", favoritesRoutes);
app.use("/api/search-history", searchHistoryRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Serve o frontend buildado em produção
const distPath = path.join(__dirname, "..", "dist");
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
  console.log(`👉 Servindo frontend de: ${distPath}`);
}

app.listen(PORT, () => {
  console.log(`Zelda Chronicles API running on http://localhost:${PORT}`);
});

