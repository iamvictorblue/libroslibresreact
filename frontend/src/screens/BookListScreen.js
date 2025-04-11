import React, { useState, useEffect, useCallback } from 'react';
import { FlatList, RefreshControl, Text, View, ActivityIndicator, Animated, SectionList } from 'react-native';
import styled from 'styled-components/native';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import BookCard from '../components/BookCard';
import FAB from '../components/FAB';
import Toast from '../components/Toast';
import Button from '../components/Button';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';

const API_URL = 'http://192.168.0.16:3000';

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 18) return 'Good Afternoon';
  return 'Good Evening';
};

const BookListScreen = ({ navigation }) => {
  const { author, logout } = useAuth();
  const [books, setBooks] = useState([]);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });
  const scrollY = React.useRef(new Animated.Value(0)).current;
  const [greeting] = useState(getGreeting());

  const handleLogout = async () => {
    try {
      await logout();
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }]
      });
    } catch (error) {
      console.error('Error during logout:', error);
      setToast({
        visible: true,
        message: 'Failed to logout. Please try again.',
        type: 'error'
      });
    }
  };

  const groupBooksByGenre = useCallback((booksList) => {
    const grouped = booksList.reduce((acc, book) => {
      const genre = book.genre || 'Uncategorized';
      if (!acc[genre]) {
        acc[genre] = [];
      }
      acc[genre].push(book);
      return acc;
    }, {});

    return Object.entries(grouped)
      .map(([genre, books]) => ({
        title: genre,
        data: [books] // Wrap books in an array since we'll use horizontal FlatList
      }))
      .sort((a, b) => a.title.localeCompare(b.title));
  }, []);

  const fetchBooks = useCallback(async () => {
    if (!author?.id) {
      console.log('No author ID available');
      return;
    }
    
    try {
      setError(null);
      setLoading(true);
      console.log(`Fetching books for author ID: ${author.id}`);
      const response = await axios.get(`${API_URL}/libros?authorId=${author.id}`);
      console.log('Books response:', response.data);
      const booksData = response.data || [];
      setBooks(booksData);
      setSections(groupBooksByGenre(booksData));
    } catch (error) {
      console.error('Error fetching books:', error);
      setError('Failed to load books. Please try again.');
      setBooks([]);
      setSections([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [author?.id, groupBooksByGenre]);

  useFocusEffect(
    useCallback(() => {
      console.log('Screen focused, fetching books...');
      fetchBooks();
    }, [fetchBooks])
  );

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSections(groupBooksByGenre(books));
    } else {
      const filteredBooks = books.filter(book => 
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (book.genre && book.genre.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setSections(groupBooksByGenre(filteredBooks));
    }
  }, [searchQuery, books, groupBooksByGenre]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchBooks();
  };

  const handleBookPress = (book) => {
    navigation.navigate('BookDetail', { bookId: book.id });
  };

  const renderItem = ({ item }) => (
    <View style={{ 
      flexDirection: 'row',
      paddingLeft: 16,
      paddingRight: 16
    }}>
      {item.map((book) => (
        <BookCard 
          key={book.id}
          book={book} 
          onPress={() => handleBookPress(book)}
        />
      ))}
    </View>
  );

  const renderSectionHeader = ({ section }) => (
    <GenreHeader>
      <GenreTitle>{section.title}</GenreTitle>
    </GenreHeader>
  );

  if (loading) {
    return (
      <LoadingContainer>
        <ActivityIndicator size="large" color="#0d6efd" />
      </LoadingContainer>
    );
  }

  return (
    <Container>
      <HeaderBackground>
        <SafeArea>
          <HeaderContent>
            <HeaderTop>
              <HeaderTitle>{greeting}</HeaderTitle>
              <LogoutButton onPress={handleLogout}>
                <LogoutText>Logout</LogoutText>
              </LogoutButton>
            </HeaderTop>
            <SearchContainer>
              <SearchIcon>
                <Ionicons name="search" size={20} color="#6c757d" />
              </SearchIcon>
              <SearchInput
                placeholder="Find your next book..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor="#6c757d"
              />
            </SearchContainer>
          </HeaderContent>
        </SafeArea>
      </HeaderBackground>

      {error ? (
        <ErrorContainer>
          <ErrorText>{error}</ErrorText>
          <Button 
            title="Try Again" 
            onPress={fetchBooks} 
            variant="outline"
            style={{ marginTop: 16 }}
          />
        </ErrorContainer>
      ) : sections.length === 0 ? (
        <EmptyContainer>
          {searchQuery ? (
            <>
              <EmptyText>No books found</EmptyText>
              <EmptySubText>Try a different search term</EmptySubText>
            </>
          ) : (
            <>
              <EmptyText>You don't have any books yet</EmptyText>
              <EmptySubText>Tap the + button to add your first book</EmptySubText>
            </>
          )}
        </EmptyContainer>
      ) : (
        <SectionList
          sections={sections}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{
            paddingBottom: 32
          }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          stickySectionHeadersEnabled={false}
        />
      )}

      <FAB onPress={() => navigation.navigate('AddBook')} />

      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onDismiss={() => setToast({ ...toast, visible: false })}
      />
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
  background-color: #ffffff;
`;

const HeaderBackground = styled.View`
  background-color: #ffffff;
  padding-top: 44px;
  border-bottom-width: 1px;
  border-bottom-color: #f1f3f5;
`;

const SafeArea = styled.SafeAreaView`
  background-color: #ffffff;
`;

const HeaderContent = styled.View`
  padding: 16px;
`;

const HeaderTop = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const HeaderTitle = styled.Text`
  font-size: 28px;
  font-weight: bold;
  color: #212529;
`;

const SearchContainer = styled.View`
  background-color: #f8f9fa;
  border-radius: 12px;
  padding: 12px;
  margin-top: 16px;
  flex-direction: row;
  align-items: center;
`;

const SearchIcon = styled.View`
  margin-right: 8px;
`;

const SearchInput = styled.TextInput`
  flex: 1;
  font-size: 16px;
  color: #212529;
`;

const LogoutButton = styled.TouchableOpacity`
  padding: 8px;
`;

const LogoutText = styled.Text`
  color: #0d6efd;
  font-weight: 500;
`;

const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #f8f9fa;
`;

const ErrorContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const ErrorText = styled.Text`
  font-size: 16px;
  color: #dc3545;
  text-align: center;
  margin-bottom: 8px;
`;

const EmptyContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const EmptyText = styled.Text`
  font-size: 18px;
  font-weight: 500;
  color: #212529;
  margin-bottom: 8px;
`;

const EmptySubText = styled.Text`
  font-size: 16px;
  color: #6c757d;
  text-align: center;
`;

const GenreHeader = styled.View`
  padding-horizontal: 24px;
  padding-vertical: 16px;
  background-color: #ffffff;
`;

const GenreTitle = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: #212529;
`;

export default BookListScreen; 