
import express from "express";
import { connectToDatabase } from "./database.js";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger.js";

const app = express();

app.use(express.json());

// SWAGGER API DOCUMENTATION
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// HOME ROUTE
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to the CSE 341 Books Web Service"
  });
});

/**
 * @swagger
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       required:
 *         - id
 *         - authorId
 *         - title
 *         - publicationDate
 *       properties:
 *         id:
 *           type: string
 *           example: b1
 *         authorId:
 *           type: string
 *           example: a1
 *         title:
 *           type: string
 *           example: Things Fall Apart
 *         publicationDate:
 *           type: string
 *           format: date
 *           example: 1958-06-17
 *     BookInput:
 *       type: object
 *       required:
 *         - id
 *         - authorId
 *         - title
 *         - publicationDate
 *       properties:
 *         id:
 *           type: string
 *           example: b2
 *         authorId:
 *           type: string
 *           example: a1
 *         title:
 *           type: string
 *           example: Arrow of God
 *         publicationDate:
 *           type: string
 *           format: date
 *           example: 1964-01-01
 */

/**
 * @swagger
 * /books:
 *   get:
 *     summary: Retrieve all books
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: List of books retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 *       500:
 *         description: Internal server error
 *
 * /books/{id}:
 *   get:
 *     summary: Retrieve one book by custom ID
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: b1
 *     responses:
 *       200:
 *         description: Book retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       404:
 *         description: Book not found
 *       500:
 *         description: Internal server error
 */

// GET ALL BOOKS
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

// GET ONE BOOK BY CUSTOM ID
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

/**
 * @swagger
 * components:
 *   schemas:
 *     Author:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - birthYear
 *       properties:
 *         id:
 *           type: string
 *           example: a1
 *         name:
 *           type: string
 *           example: Chinua Achebe
 *         birthYear:
 *           type: integer
 *           example: 1930
 *     AuthorInput:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - birthYear
 *       properties:
 *         id:
 *           type: string
 *           example: a2
 *         name:
 *           type: string
 *           example: Wole Soyinka
 *         birthYear:
 *           type: integer
 *           example: 1934
 *     AuthorUpdate:
 *       type: object
 *       required:
 *         - name
 *         - birthYear
 *       properties:
 *         name:
 *           type: string
 *           example: Wole Soyinka
 *         birthYear:
 *           type: integer
 *           example: 1934
 */

/**
 * @swagger
 * /authors:
 *   get:
 *     summary: Retrieve all authors
 *     tags: [Authors]
 *     responses:
 *       200:
 *         description: List of authors retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Author'
 *       500:
 *         description: Internal server error
 *   post:
 *     summary: Create a new author
 *     tags: [Authors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthorInput'
 *     responses:
 *       201:
 *         description: Author created successfully
 *       400:
 *         description: Invalid author information or duplicate ID
 *       500:
 *         description: Internal server error
 */

// GET ALL AUTHORS
app.get("/authors", async (req, res) => {
  try {
    const db = await connectToDatabase();

    const authors = await db.collection("authors")
      .find({}, { projection: { _id: 0 } })
      .toArray();

    return res.status(200).json(authors);
  } catch (error) {
    console.error("Error retrieving authors:", error.message);

    return res.status(500).json({
      message: "Internal server error"
    });
  }
});

/**
 * @swagger
 * /authors/{id}:
 *   get:
 *     summary: Retrieve one author by custom ID
 *     tags: [Authors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: a1
 *     responses:
 *       200:
 *         description: Author retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Author'
 *       404:
 *         description: Author not found
 *       500:
 *         description: Internal server error
 *   put:
 *     summary: Update an existing author
 *     tags: [Authors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: a1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthorUpdate'
 *     responses:
 *       200:
 *         description: Author updated successfully
 *       400:
 *         description: Invalid information or attempt to change author ID
 *       404:
 *         description: Author not found
 *       500:
 *         description: Internal server error
 *   delete:
 *     summary: Delete an author
 *     tags: [Authors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: a1
 *     responses:
 *       204:
 *         description: Author deleted successfully
 *       404:
 *         description: Author not found
 *       409:
 *         description: Cannot delete an author referenced by books
 *       500:
 *         description: Internal server error
 */

// GET ONE AUTHOR BY CUSTOM ID
app.get("/authors/:id", async (req, res) => {
  try {
    const db = await connectToDatabase();

    const author = await db.collection("authors").findOne(
      { id: req.params.id },
      { projection: { _id: 0 } }
    );

    if (!author) {
      return res.status(404).json({
        message: "Author not found"
      });
    }

    return res.status(200).json(author);
  } catch (error) {
    console.error("Error retrieving author:", error.message);

    return res.status(500).json({
      message: "Internal server error"
    });
  }
});

// CREATE A NEW AUTHOR
app.post("/authors", async (req, res) => {
  try {
    const { id, name, birthYear } = req.body;

    if (
      typeof id !== "string" ||
      !id.trim() ||
      typeof name !== "string" ||
      !name.trim() ||
      !Number.isInteger(birthYear) ||
      birthYear < 1 ||
      birthYear > new Date().getFullYear()
    ) {
      return res.status(400).json({
        message: "Please provide a valid id, name, and birthYear"
      });
    }

    const db = await connectToDatabase();
    const authors = db.collection("authors");

    const existingAuthor = await authors.findOne({
      id: id.trim()
    });

    if (existingAuthor) {
      return res.status(400).json({
        message: "An author with this ID already exists"
      });
    }

    const newAuthor = {
      id: id.trim(),
      name: name.trim(),
      birthYear
    };

    await authors.insertOne(newAuthor);

    return res.status(201).json({
      id: newAuthor.id,
      name: newAuthor.name,
      birthYear: newAuthor.birthYear
    });
  } catch (error) {
    console.error("Error creating author:", error.message);

    return res.status(500).json({
      message: "Internal server error"
    });
  }
});

// UPDATE AN EXISTING AUTHOR
app.put("/authors/:id", async (req, res) => {
  try {
    const authorId = req.params.id;
    const { name, birthYear, id } = req.body;

    if (id !== undefined) {
      return res.status(400).json({
        message: "The author ID cannot be changed"
      });
    }

    if (
      typeof name !== "string" ||
      !name.trim() ||
      !Number.isInteger(birthYear) ||
      birthYear < 1 ||
      birthYear > new Date().getFullYear()
    ) {
      return res.status(400).json({
        message: "Please provide a valid name and birthYear"
      });
    }

    const db = await connectToDatabase();
    const authors = db.collection("authors");

    const existingAuthor = await authors.findOne({
      id: authorId
    });

    if (!existingAuthor) {
      return res.status(404).json({
        message: "Author not found"
      });
    }

    await authors.updateOne(
      { id: authorId },
      {
        $set: {
          name: name.trim(),
          birthYear
        }
      }
    );

    const updatedAuthor = await authors.findOne(
      { id: authorId },
      { projection: { _id: 0 } }
    );

    return res.status(200).json(updatedAuthor);
  } catch (error) {
    console.error("Error updating author:", error.message);

    return res.status(500).json({
      message: "Internal server error"
    });
  }
});

// DELETE AN AUTHOR
app.delete("/authors/:id", async (req, res) => {
  try {
    const authorId = req.params.id;

    const db = await connectToDatabase();
    const authors = db.collection("authors");
    const books = db.collection("books");

    const existingAuthor = await authors.findOne({
      id: authorId
    });

    if (!existingAuthor) {
      return res.status(404).json({
        message: "Author not found"
      });
    }

    const relatedBooks = await books.countDocuments({
      authorId: authorId
    });

    if (relatedBooks > 0) {
      return res.status(409).json({
        message: "Cannot delete this author because books reference this author"
      });
    }

    await authors.deleteOne({
      id: authorId
    });

    return res.status(204).send();
  } catch (error) {
    console.error("Error deleting author:", error.message);

    return res.status(500).json({
      message: "Internal server error"
    });
  }
});

export default app;
