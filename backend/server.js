import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// Configure dotenv
dotenv.config();

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Handle /query endpoint
app.post("/query", async (req, res) => {
  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ error: "Query required" });
  }

  try {
    const response = await axios.post(
      "http://127.0.0.1:5000/query",
      { question: query },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const prediction = response.data.response.trim();
    res.json({ response: prediction });
  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
    res
      .status(500)
      .json({ error: "Failed to fetch response from Python server" });
  }
});

// Handle /submit-review endpoint
app.post("/submit-review", (req, res) => {
  const { time, rating, input, messages } = req.body;

  const review = {
    time,
    rating,
    input,
    messages,
  };

  const filePath = path.join(__dirname, "reviews.json");

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error reading file");
    }

    const reviews = data ? JSON.parse(data) : [];
    reviews.push(review);

    fs.writeFile(filePath, JSON.stringify(reviews, null, 2), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Error writing file");
      }

      res.send("Review submitted successfully");
    });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
