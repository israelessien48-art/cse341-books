import app from "./app.js";

const PORT = process.env.PORT;

if (!PORT) {
  throw new Error("PORT environment variable is not set");
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});