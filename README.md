# Libros Libres

A mobile app built with React Native that lets users manage their book collections. Users can login with their email and manage their personal library by adding, editing, and deleting books.

## Features

- User authentication via email
- View list of books in your collection
- Add new books with title, author, genre, and rating
- Edit existing books
- Delete books from your collection
- Clean, modern interface inspired by Notion, Goodreads, and Apple Books
- Image upload support for book covers
- Genre categorization and filtering
- Search functionality
- Pull-to-refresh for book list updates

## Tech Stack

### Frontend
- React Native
- React Navigation for screen navigation
- Styled Components for styling
- Axios for API requests
- AsyncStorage for local data persistence
- Expo for development and building

### Backend
- Node.js with Express
- PostgreSQL database
- RESTful API endpoints
- JWT for authentication
- Multer for image uploads

## Running the Application

### Prerequisites
- Node.js (v14+)
- PostgreSQL (v12+)
- Expo CLI (`npm install -g expo-cli`)
- Git

### Initial Setup
1. Clone the repository:
```bash
git clone [repository-url]
cd libroslibresreact
```

### Backend Setup
1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with your database configuration:
```env
PORT=3000
DB_USER=postgres
DB_HOST=localhost
DB_NAME=libroslibres
DB_PASSWORD=postgres
DB_PORT=5432
JWT_SECRET=your_jwt_secret_here
```

4. Create the database:
```bash
createdb libroslibres
```

5. Start the server:
```bash
npm run dev
```

### Frontend Setup
1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with your API configuration:
```env
API_URL=http://localhost:3000
```

4. Start the Expo development server:
```bash
npm start
```

5. Follow the instructions to:
   - Press 'i' to open in iOS simulator (if on Mac)
   - Press 'a' to open in Android emulator
   - Scan QR code with Expo Go app on your physical device

## API Endpoints

### Authentication
- **POST /auth/register**: Register a new user
- **POST /auth/login**: Login existing user
- **GET /auth/me**: Get current user info

### Books
- **GET /books**: Get all books for a user
- **POST /books**: Add a new book
- **GET /books/:id**: Get a specific book
- **PUT /books/:id**: Update a book
- **DELETE /books/:id**: Delete a book
- **POST /books/:id/upload**: Upload book cover image

## Sample Data

The backend automatically seeds the database with sample users and books when first run:

- User: test@example.com / password: test123 (with 2 sample books)
- User: reader@books.com / password: reader123 (with 2 sample books)

## Troubleshooting

### Common Issues
1. **Database Connection Failed**
   - Ensure PostgreSQL is running
   - Verify database credentials in `.env`
   - Check if database exists: `createdb libroslibres`

2. **Expo App Won't Connect to Backend**
   - Ensure backend server is running
   - Check if API_URL in frontend `.env` is correct
   - For physical devices, use your computer's local IP instead of localhost

3. **Image Upload Issues**
   - Ensure uploads directory exists in backend
   - Check file size limits
   - Verify file type restrictions

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.