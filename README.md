---

# Books Management System

A RESTful API project that manages users, books, and book reviews in a MongoDB database, allowing for user registration, login, book management, and review functionality.

---

## Project Overview

- **Database**: `booksDatabase`
- **Branching**: Use a single Git branch named `project/booksManagement`.
- **Team Coordination**: Ensure each team member pulls the latest code before pushing to avoid conflicts.

---

## Models

### User Model
```javascript
{
  title: {string, mandatory, enum: ["Mr", "Mrs", "Miss"]},
  name: {string, mandatory},
  phone: {string, mandatory, unique},
  email: {string, mandatory, unique, format: valid email},
  password: {string, mandatory, minLen: 8, maxLen: 15},
  address: {
    street: {string},
    city: {string},
    pincode: {string}
  },
  createdAt: {timestamp},
  updatedAt: {timestamp}
}
```

### Books Model
```javascript
{
  title: {string, mandatory, unique},
  excerpt: {string, mandatory},
  userId: {ObjectId, mandatory, ref: 'User'},
  ISBN: {string, mandatory, unique},
  category: {string, mandatory},
  subcategory: [string, mandatory],
  reviews: {number, default: 0, comment: "Holds number of reviews for this book"},
  deletedAt: {date},
  isDeleted: {boolean, default: false},
  releasedAt: {date, mandatory, format: "YYYY-MM-DD"},
  createdAt: {timestamp},
  updatedAt: {timestamp}
}
```

### Review Model
```javascript
{
  bookId: {ObjectId, mandatory, ref: 'Book'},
  reviewedBy: {string, mandatory, default: 'Guest'},
  reviewedAt: {date, mandatory},
  rating: {number, min: 1, max: 5, mandatory},
  review: {string, optional},
  isDeleted: {boolean, default: false}
}
```

---

## API Endpoints

### User APIs

- **POST /register**
  - Create a new user with the required fields.
  - **Response**:
    - Success: `HTTP 201` with user document.
    - Error: `HTTP 400` if invalid or missing parameters.

- **POST /login**
  - User login using email and password.
  - **Response**:
    - Success: JWT token containing userId, exp, and iat.
    - Error: `HTTP 401` for invalid credentials.

### Books API

- **POST /books**
  - Create a new book document. Requires userId in request body.
  - **Response**:
    - Success: `HTTP 201` with book document.
    - Error: `HTTP 400` for invalid input.

- **GET /books**
  - Retrieve all non-deleted books with optional filtering by `userId`, `category`, or `subcategory`.
  - **Response**:
    - Success: `HTTP 200` with a list of books.
    - Error: `HTTP 404` if no books are found.

- **GET /books/:bookId**
  - Retrieve a book's full details, including reviews.
  - **Response**:
    - Success: `HTTP 200` with book and reviews.
    - Error: `HTTP 404` if the book is not found.

- **PUT /books/:bookId**
  - Update a book's `title`, `excerpt`, `release date`, or `ISBN`.
  - **Response**:
    - Success: `HTTP 200` with updated book document.
    - Error: `HTTP 404` if the book is not found.

- **DELETE /books/:bookId**
  - Soft delete a book by marking it as `isDeleted: true`.
  - **Response**:
    - Success: `HTTP 200` with status and message.
    - Error: `HTTP 404` if the book is not found.

### Review APIs

- **POST /books/:bookId/review**
  - Add a review to a book, updating the book’s review count.
  - **Response**:
    - Success: `HTTP 201` with updated book and review data.
    - Error: `HTTP 404` if the book is not found.

- **PUT /books/:bookId/review/:reviewId**
  - Update a review with new `review`, `rating`, or `reviewedBy`.
  - **Response**:
    - Success: `HTTP 200` with updated review.
    - Error: `HTTP 404` if the book or review is not found.

- **DELETE /books/:bookId/review/:reviewId**
  - Delete a review and update the book’s review count.
  - **Response**:
    - Success: `HTTP 200` with status and message.
    - Error: `HTTP 404` if the book or review is not found.

---

## Authentication & Authorization

- **Authentication**: All book routes require authentication.
- **Authorization**: Only book owners can create, edit, or delete their books.
  - Unauthorized access returns an appropriate error message.

---

## Testing

Create a Postman collection titled `Project 4 Books Management` with individual requests for each API endpoint. Ensure each request is correctly named (e.g., `Create user`, `Get books`) and has running test states.

---

## Response Structures

### Successful Response
```javascript
{
  status: true,
  message: "Success",
  data: {}
}
```

### Error Response
```javascript
{
  status: false,
  message: ""
}
```

---

## Collections Schema Examples

### Users
```javascript
{
  _id: ObjectId("88abc190ef0288abc190ef02"),
  title: "Mr",
  name: "John Doe",
  phone: "9897969594",
  email: "johndoe@mailinator.com",
  password: "abcd1234567",
  address: {
    street: "110, Ridhi Sidhi Tower",
    city: "Jaipur",
    pincode: "400001"
  },
  createdAt: "2021-09-17T04:25:07.803Z",
  updatedAt: "2021-09-17T04:25:07.803Z"
}
```

### Books
```javascript
{
  _id: ObjectId("88abc190ef0288abc190ef55"),
  title: "How to Win Friends and Influence People",
  excerpt: "book body",
  userId: ObjectId("88abc190ef0288abc190ef02"),
  ISBN: "978-0008391331",
  category: "Book",
  subcategory: ["Non-fiction"],
  reviews: 0,
  releasedAt: "2021-09-17",
  createdAt: "2021-09-17T04:25:07.803Z",
  updatedAt: "2021-09-17T04:25:07.803Z"
}
```

### Reviews
```javascript
{
  _id: ObjectId("88abc190ef0288abc190ef88"),
  bookId: ObjectId("88abc190ef0288abc190ef55"),
  reviewedBy: "Jane Doe",
  reviewedAt: "2021-09-17T04:25:07.803Z",
  rating: 4,
  review: "An exciting, thrilling tale. A must-read!"
}
```

---