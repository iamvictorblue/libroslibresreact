# Libros Libres

A mobile app built with React Native that lets users manage their book collections. Users can login with their email and manage their personal library by adding, editing, and deleting books.

## Features

- User authentication via email
- View list of books in your collection
- Add new books with title, author, genre, and rating
- Edit existing books
- Delete books from your collection
- Clean, modern interface inspired by Notion, Goodreads, and Apple Books

## Tech Stack

### Frontend
- React Native
- React Navigation for screen navigation
- Styled Components for styling
- Axios for API requests
- AsyncStorage for local data persistence

### Backend
- Node.js with Express
- PostgreSQL database
- RESTful API endpoints

## Running the Application

### Prerequisites
- Node.js (v14+)
- PostgreSQL
- React Native w/ Expo CLI

### Backend Setup
1. Navigate to the backend directory:
```
cd backend
```

2. Install dependencies:
```
npm install
```

3. Create a `.env` file with your database configuration:
```
PORT=3000
DB_USER=postgres
DB_HOST=localhost
DB_NAME=libroslibres
DB_PASSWORD=postgres
DB_PORT=5432
```

4. Start the server:
```
npm run dev
```

### Frontend Setup
1. Navigate to the frontend directory:
```
cd frontend
```

2. Install dependencies:
```
npm install
```

3. Start the Expo development server:
```
npm start
```

4. Follow instructions to open the app in an emulator or on your physical device through the Expo Go app.

## API Endpoints

- **POST /login**: Login or register a user
- **GET /libros**: Get all books for a user
- **POST /libros**: Add a new book
- **GET /libros/:id**: Get a specific book
- **PUT /libros/:id**: Update a book
- **DELETE /libros/:id**: Delete a book

## Sample Data

The backend automatically seeds the database with sample users and books when first run:

- User: test@example.com (with 2 sample books)
- User: reader@books.com (with 2 sample books)
