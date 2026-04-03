// backend/index.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const ridersRouter = require("./routes/riders");
const zonesRouter = require("./routes/zones");
const payoutsRouter = require("./routes/payouts");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/riders", ridersRouter);
app.use("/api/zones", zonesRouter);
app.use("/api/payouts", payoutsRouter);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "DASH backend running", timestamp: new Date() });
});

app.listen(PORT, () => {
  console.log(`DASH backend running on port ${PORT}`);
});
