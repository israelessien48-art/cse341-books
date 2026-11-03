# CSE 341 Week 02 Specification

## Feature 1: Books API — Version 1

### Goal

Update the existing Week 01 Books API so book documents include a reference to an author and the API supports all CRUD operations for books. Every book route must be documented and testable in Swagger.

### Data Model

Book documents will be stored in the `books` collection.

Required book fields:

- `id`: string, required, custom ID such as `b1`.
- `authorId`: string, required, references the `id` field of an author document.
- `title`: string, required.
- `publicationDate`: string, required.

Books will continue to use custom string IDs instead of MongoDB `_id` values for route parameters.

### Relationship to Authors

Each book will identify its author using an `authorId` field. The value must match the custom `id` of an existing author document.

When creating or updating a book, the API must reject the request with status `400` if the submitted `authorId` does not match an existing author.

### Routes

#### GET /books

Purpose: Return all books.

Success:
- Status: `200`.
- Response: An array of book objects.

Errors:
- `500` if an unexpected server or database error occurs.

#### GET /books/:id

Purpose: Return one book by its custom ID.

Success:
- Status: `200`.
- Response: The matching book object.

Errors:
- `404` if no book exists with that ID.
- `500` if an unexpected server or database error occurs.

#### POST /books

Purpose: Create a new book.

Request body:

```json
{
  "id": "b4",
  "authorId": "a1",
  "title": "Example Book Title",
  "publicationDate": "2026-01-15"
}
```

Success:
- Status: `201`.
- Response: The newly created book object.

Errors:
- `400` if a required field is missing or invalid.
- `400` if the ID already exists.
- `400` if the author ID does not match an existing author.
- `500` if an unexpected server or database error occurs.

#### PUT /books/:id

Purpose: Update an existing book.

Request body:

```json
{
  "authorId": "a2",
  "title": "Updated Book Title",
  "publicationDate": "2026-02-20"
}
```

Success:
- Status: `200`.
- Response: The updated book object.

Errors:
- `400` if a required field is missing or invalid.
- `400` if the author ID does not match an existing author.
- `404` if no book exists with that ID.
- `500` if an unexpected server or database error occurs.

#### DELETE /books/:id

Purpose: Delete an existing book.

Success:
- Status: `204`.
- Response: No response body.

Errors:
- `404` if no book exists with that ID.
- `500` if an unexpected server or database error occurs.

### Swagger Documentation

Swagger must document every book route, including request bodies, parameters, successful responses, and error responses.

### Deployment Expectations

All book routes must work locally and through the deployed Render application. The deployed Swagger page at `/api-docs` must allow users to test every book route.

---

## Feature 2: Authors API — Version 1

### Goal

Create an Authors API that supports all CRUD operations. Authors will be stored in a separate MongoDB collection and referenced by books through their custom IDs.

### Data Model

Author documents will be stored in the `authors` collection.

Required author fields:

- `id`: string, required, custom ID such as `a1`.
- `name`: string, required.
- `birthYear`: number, required, representing the author's year of birth.

Authors will use custom string IDs instead of MongoDB `_id` values for route parameters.

Example author:

```json
{
  "id": "a1",
  "name": "Chinua Achebe",
  "birthYear": 1930
}
```

### Routes

#### GET /authors

Purpose: Retrieve all authors.

Success:
- Status: `200`.
- Response: An array of author objects.

Errors:
- `500` if an unexpected server or database error occurs.

#### GET /authors/:id

Purpose: Retrieve one author using the author's custom ID.

Success:
- Status: `200`.
- Response: The matching author object.

Errors:
- `404` if the author does not exist.
- `500` if an unexpected server or database error occurs.

#### POST /authors

Purpose: Create a new author.

Request body:

```json
{
  "id": "a1",
  "name": "Chinua Achebe",
  "birthYear": 1930
}
```

Success:
- Status: `201`.
- Response: The newly created author object.

Errors:
- `400` if a required field is missing or invalid.
- `400` if the author ID already exists.
- `500` if an unexpected server or database error occurs.

#### PUT /authors/:id

Purpose: Update an existing author.

Request body:

```json
{
  "name": "Chinua Achebe",
  "birthYear": 1930
}
```

Success:
- Status: `200`.
- Response: The updated author object.

Errors:
- `400` if a required field is missing or invalid.
- `404` if the author does not exist.
- `500` if an unexpected server or database error occurs.

#### DELETE /authors/:id

Purpose: Delete an existing author.

Success:
- Status: `204`.
- Response: No response body.

Errors:
- `404` if the author does not exist.
- `409` if the author still has books referencing their ID.
- `500` if an unexpected server or database error occurs.

### Relationship to Books

The relationship is one-to-many:

- One author can have multiple books.
- Each book references one author through `authorId`.
- Every `authorId` must match an existing author's custom `id`.

An author cannot be deleted while books still reference that author. The API will return `409 Conflict` to protect the relationship.

### Swagger Documentation

Swagger must document every author route, including:

- Route parameters.
- JSON request bodies.
- Successful responses.
- Validation errors.
- Not-found responses.
- Conflict responses.
- Unexpected server errors.

### Deployment Expectations

All author routes must work locally and through the deployed Render application. The deployed `/api-docs` page must allow users to test every author route.

---

## Specification Evaluation — Version 1

### 1. Possible bugs or short-sighted decisions

The API must prevent duplicate custom IDs. It must also ensure that books reference existing authors. Deleting an author who still has books could create broken references, so the API should reject that operation with `409 Conflict`.

### 2. Security considerations

The API must validate all incoming data on the server. It must not trust client-submitted IDs or values without checking them. Database error details and connection information must not be exposed to API clients. MongoDB credentials must remain in environment variables and must not be committed to GitHub.

### 3. Efficiency concerns

The API should retrieve only the required documents and fields. It should avoid unnecessary database queries. When checking author references, it should query the authors collection using the custom ID.

### 4. Response clarity

All routes should return consistent JSON error messages. A missing resource should return `404`, invalid input should return `400`, a conflicting author deletion should return `409`, and unexpected server failures should return `500`.

---

## Feature 1: Books API — Version 2

### Improvements

- Require all four fields: `id`, `authorId`, `title`, and `publicationDate`.
- Validate that book IDs are non-empty strings and unique.
- Validate that `authorId` is a non-empty string referencing an existing author.
- Validate that titles are non-empty strings.
- Validate `publicationDate` as a real calendar date in `YYYY-MM-DD` format.
- Verify that `authorId` references an existing author before creating or updating a book.
- Reject duplicate book IDs.
- Use the URL ID as the identifier when updating or deleting a book. Do not allow the request body to replace the book's custom ID.
- Return consistent JSON error responses for failed requests.
- Never expose raw database errors or sensitive connection information.
- Document every route and response in Swagger.
- Test all routes locally and on Render.

### Final Book Route Requirements

| Method | Route | Expected success |
|---|---|---|
| GET | `/books` | 200 |
| GET | `/books/:id` | 200 |
| POST | `/books` | 201 |
| PUT | `/books/:id` | 200 |
| DELETE | `/books/:id` | 204 |

Additional error responses:

- `400`: Invalid input, missing fields, duplicate ID, or invalid author reference.
- `404`: Book not found.
- `500`: Unexpected server or database error.

---

## Feature 2: Authors API — Version 2

### Improvements

- Require `id`, `name`, and `birthYear`.
- Validate that author IDs are non-empty strings and unique.
- Validate that author names are non-empty strings.
- Validate that `birthYear` is an integer and is not in the future.
- Reject duplicate author IDs.
- Use the URL ID when updating or deleting an author. Do not allow the request body to replace the author's custom ID.
- Check whether books reference an author before deleting that author.
- Return `409 Conflict` if books still reference the author.
- Return consistent JSON error responses for failed requests.
- Never expose raw database errors or sensitive connection information.
- Document every route and response in Swagger.
- Test all routes locally and on Render.

### Final Author Route Requirements

| Method | Route | Expected success |
|---|---|---|
| GET | `/authors` | 200 |
| GET | `/authors/:id` | 200 |
| POST | `/authors` | 201 |
| PUT | `/authors/:id` | 200 |
| DELETE | `/authors/:id` | 204 |

Additional error responses:

- `400`: Invalid input, missing fields, duplicate ID, or invalid birth year.
- `404`: Author not found.
- `409`: Author still has books.
- `500`: Unexpected server or database error.

---

## Final Implementation Checklist

- [ ] Complete all Book CRUD routes.
- [ ] Add the `authorId` reference to book documents.
- [ ] Complete all Author CRUD routes.
- [ ] Validate all request data on the server.
- [ ] Prevent duplicate custom IDs.
- [ ] Prevent invalid author references.
- [ ] Prevent deleting authors with existing books.
- [ ] Add complete Swagger documentation.
- [ ] Test every route using Swagger at `/api-docs`.
- [ ] Deploy the completed API to Render.
- [ ] Verify the hosted `/api-docs` page.
- [ ] Record a walk-through video showing all required rubric items.
- [ ] Complete the reflection document with PR links and video link.