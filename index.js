const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

dotenv.config();

/* =======================
   MONGOOSE CONFIG
======================= */
mongoose.set("strictQuery", false);

if (process.env.MONGO_URL) {
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log("✅ DB Connection Successful!"))
    .catch((err) => {
      console.error("❌ DB Connection Error:", err);
    });
} else {
  console.warn(
    "⚠️ MONGO_URL not set. DB connection skipped. Set it in Render ENV."
  );
}

/* =======================
   MIDDLEWARE (ORDER MATTERS)
======================= */
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173"
      // add deployed frontend later
    ],
    credentials: true
  })
);

// REQUIRED body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =======================
   ROUTES IMPORT
======================= */
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const productRoute = require("./routes/product");
const serviceRoute = require("./routes/service");
const appointmentRoute = require("./routes/appointment");
const slotRoute = require("./routes/slot");
const orderRoute = require("./routes/order");
const uploadRoute = require("./routes/upload");
const workersRoute = require("./routes/workers");
const adminRouter = require("./admin");

/* =======================
   BASIC TEST ROUTE
======================= */
app.get("/", (req, res) => {
  res.send("🚀 API is running...");
});

/* =======================
   API ROUTES
======================= */
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/services", serviceRoute);
app.use("/api/appointments", appointmentRoute);
app.use("/api/slots", slotRoute);
app.use("/api/orders", orderRoute);
app.use("/api/upload", uploadRoute);
app.use("/api/workers", workersRoute);
app.use("/api/admin", adminRouter);

/* =======================
   STATIC FILES
======================= */
app.use(
  "/uploads",
  express.static(path.join(__dirname, "public", "uploads"))
);

/* =======================
   SERVER START
======================= */
const PORT = process.env.PORT || 5001;

const server = app.listen(PORT, () => {
  console.log(`✅ Backend server running on port ${PORT}`);
});

/* =======================
   SERVER ERROR HANDLING
======================= */
server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(
      `❌ Port ${PORT} already in use. Change PORT in environment variables.`
    );
  } else {
    console.error("❌ Server error:", err);
  }
  process.exit(1);
});
