
import { MongoClient } from "mongodb";

let database;

export async function connectToDatabase() {
  if (database) {
    return database;
  }

  const connectionString = process.env.MONGODB_URI;

  if (!connectionString) {
    throw new Error("MONGODB_URI environment variable is not set");
  }

  const client = new MongoClient(connectionString);
  await client.connect();

  database = client.db("cse341-books-db");

  console.log("Connected to MongoDB Atlas");

  return database;
}
