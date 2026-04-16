const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const path = require("path");
require("dotenv").config();

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  message: {
    message: "שלחת יותר מדי בקשות בזמן קצר. אנא נסה שוב בעוד 15 דקות.",
  },
});

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(limiter);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const db = process.env.MONGO_URI;

mongoose
  .connect(db)
  .then(() => console.log("DB Connected"))
  .catch((err) => console.error("DB Connection Error:", err.message));

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/jobs", require("./routes/jobRoutes"));
app.use("/api/messages", require("./routes/messageRoutes"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));
