
import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "CSE 341 Books Web Service API",
      version: "1.0.0",
      description:
        "API documentation for managing books and authors."
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Local development server"
      }
    ]
  },
  apis: ["./app.js"]
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
