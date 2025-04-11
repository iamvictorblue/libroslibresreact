# API Documentation

## Authentication Endpoints

### POST /auth/register
Register a new user.
```json
{
  "username": "string",
  "password": "string",
  "email": "string"
}
```

### POST /auth/login
Login user.
```json
{
  "username": "string",
  "password": "string"
}
```

## Book Endpoints

### GET /libros
Get all books for authenticated user.
- Headers: `Authorization: Bearer {token}`
- Query params: 
  - `authorId`: string
  - `genre`: string (optional)

### POST /libros
Create new book.
- Headers: `Authorization: Bearer {token}`
- Content-Type: `multipart/form-data`
```json
{
  "title": "string",
  "author": "string",
  "genre": "string",
  "rating": "number",
  "coverImage": "file"
}
```

### PUT /libros/:id
Update existing book.
- Headers: `Authorization: Bearer {token}`
- Content-Type: `multipart/form-data`
```json
{
  "title": "string",
  "author": "string",
  "genre": "string",
  "rating": "number",
  "coverImage": "file"
}
```

### DELETE /libros/:id
Delete book.
- Headers: `Authorization: Bearer {token}`

## Response Formats

### Success Response
```json
{
  "success": true,
  "data": {}
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message"
}
``` 