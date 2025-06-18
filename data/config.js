const mongoose = require("mongoose");
require("dotenv").config();

const URL = process.env.DATABASE_URL || process.env.URL;

const ConnectDB = async () => {
  try {
    // Configuración optimizada para Railway
    await mongoose.connect(URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log("✅ Database connected successfully");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }
};

module.exports = { ConnectDB };
