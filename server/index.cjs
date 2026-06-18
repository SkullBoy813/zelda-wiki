const express = require("express");
const cors = require("cors");
const path = require("path");

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

app.listen(PORT, () => {
  console.log(`Zelda Chronicles API running on http://localhost:${PORT}🟩🟩`);
});

