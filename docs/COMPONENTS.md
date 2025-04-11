# Components Documentation

## Reusable Components

### BookCard
Displays a book in grid or list view.

**Props:**
```javascript
{
  book: {
    id: number,
    title: string,
    author: string,
    genre: string,
    rating: number,
    coverImage: string
  },
  onPress: function
}
```

### GenreDropdown
Genre selection component with modal interface.

**Props:**
```javascript
{
  value: string,
  onSelect: function,
  error: string
}
```

### RatingStars
Interactive star rating component.

**Props:**
```javascript
{
  rating: number,
  size: number,
  editable: boolean,
  onRatingChange: function
}
```

### FormInput
Standardized input field with validation.

**Props:**
```javascript
{
  label: string,
  value: string,
  onChangeText: function,
  error: string,
  placeholder: string
}
```

### Toast
Notification component for user feedback.

**Props:**
```javascript
{
  visible: boolean,
  message: string,
  type: 'success' | 'error',
  onDismiss: function
}
```

## Screen Components

### BookListScreen
Main screen displaying book grid with genre sections.

**Features:**
- Genre categorization
- Search functionality
- Pull-to-refresh
- Add book FAB
- Logout functionality

### BookDetailScreen
Detailed view of a book with edit capabilities.

**Features:**
- View book details
- Edit book information
- Change cover image
- Delete book
- Rating modification

### AddBookScreen
Form for adding new books.

**Features:**
- Title and author input
- Genre selection
- Rating selection
- Cover image upload
- Form validation 