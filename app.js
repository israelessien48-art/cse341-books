
import express from "express";
import { connectToDatabase } from "./database.js";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to the CSE 341 Books Web Service"
  });
});

app.get("/books", async (req, res) => {
  try {
    const db = await connectToDatabase();

    const books = await db.collection("books")
      .find({}, { projection: { _id: 0 } })
      .toArray();

    return res.status(200).json(books);
  } catch (error) {
    console.error("Error retrieving books:", error.message);

    return res.status(500).json({
      message: "Internal server error"
    });
  }
});

app.get("/books/:id", async (req, res) => {
  try {
    const db = await connectToDatabase();

    const book = await db.collection("books").findOne(
      { id: req.params.id },
      { projection: { _id: 0 } }
    );

    if (!book) {
      return res.status(404).json({
        message: "Book not found"
      });
    }

    return res.status(200).json(book);
  } catch (error) {
    console.error("Error retrieving book:", error.message);

    return res.status(500).json({
      message: "Internal server error"
    });
  }
});

export default app;
