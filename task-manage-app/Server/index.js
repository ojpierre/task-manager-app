const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const taskRoute = require("./route/tasks");

dotenv.config();

app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB", error);
  });
    
  app.use("/api/task", taskRoute);

  app.listen("5000", () => {
      console.log("Backend is running...");
    });

  