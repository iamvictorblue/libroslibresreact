import React, { useState, useEffect, useCallback } from 'react';
import { ActivityIndicator, Alert, ScrollView, View, Dimensions, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { SharedElement } from 'react-navigation-shared-element';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../context/AuthContext';
import FormInput from '../components/FormInput';
import Button from '../components/Button';
import RatingStars from '../components/RatingStars';
import Toast from '../components/Toast';
import { Ionicons } from '@expo/vector-icons';
import GenreDropdown from '../components/GenreDropdown';

const API_URL = 'http://192.168.0.16:3000';
const { width } = Dimensions.get('window');

const BookDetailScreen = ({ navigation, route }) => {
  const { bookId } = route.params;
  const { author } = useAuth();
  
  const [book, setBook] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: '',
    rating: 0,
    coverImage: null
  });
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });

  const fetchBook = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log(`Fetching book with ID: ${bookId}`);
      const response = await axios.get(`${API_URL}/libros/${bookId}`);
      console.log('Book response:', response.data);
      setBook(response.data);
      setFormData({
        title: response.data.title,
        author: response.data.author,
        genre: response.data.genre || '',
        rating: response.data.rating || 0,
        coverImage: response.data.coverImage
      });
    } catch (error) {
      console.error('Error fetching book:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      setError('Failed to load book details');
      setToast({
        visible: true,
        message: 'Failed to load book details',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  }, [bookId]);

  useEffect(() => {
    fetchBook();
  }, [fetchBook]);

  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
    
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: null
      });
    }
  };

  const handleRatingChange = (rating) => {
    handleChange('rating', rating);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.author.trim()) {
      newErrors.author = 'Author is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        setToast({
          visible: true,
          message: 'Sorry, we need camera roll permissions to make this work!',
          type: 'error'
        });
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.8,
      });

      if (!result.canceled) {
        setFormData({
          ...formData,
          coverImage: result.assets[0].uri
        });
      }
    } catch (error) {
      console.error('Error picking image:', error);
      setToast({
        visible: true,
        message: 'Failed to pick image. Please try again.',
        type: 'error'
      });
    }
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    
    try {
      setSaving(true);
      
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('author', formData.author);
      formDataToSend.append('genre', formData.genre);
      formDataToSend.append('rating', formData.rating.toString());
      
      if (formData.coverImage && formData.coverImage !== book.coverImage) {
        formDataToSend.append('coverImage', {
          uri: formData.coverImage,
          type: 'image/jpeg',
          name: 'cover.jpg'
        });
      }
      
      await axios.put(`${API_URL}/libros/${bookId}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setToast({
        visible: true,
        message: 'Book updated successfully',
        type: 'success'
      });
      
      // Refresh book data and exit edit mode
      await fetchBook();
      setEditMode(false);
    } catch (error) {
      console.error('Error updating book:', error);
      setToast({
        visible: true,
        message: 'Failed to update book',
        type: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Book',
      'Are you sure you want to delete this book? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: confirmDelete }
      ]
    );
  };

  const confirmDelete = async () => {
    try {
      setDeleting(true);
      await axios.delete(`${API_URL}/libros/${bookId}`);
      
      setToast({
        visible: true,
        message: 'Book deleted successfully',
        type: 'success'
      });
      
      // Go back to book list after a short delay
      setTimeout(() => {
        navigation.goBack();
      }, 1000);
    } catch (error) {
      console.error('Error deleting book:', error);
      setToast({
        visible: true,
        message: 'Failed to delete book',
        type: 'error'
      });
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <LoadingContainer>
        <ActivityIndicator size="large" color="#0d6efd" />
      </LoadingContainer>
    );
  }

  if (error || !book) {
    return (
      <ErrorContainer>
        <ErrorText>{error || 'Book not found'}</ErrorText>
        <Button 
          title="Try Again" 
          onPress={fetchBook} 
          variant="outline"
          style={{ marginTop: 16 }}
        />
      </ErrorContainer>
    );
  }

  return (
    <Container>
      <HeaderBackground>
        <SafeArea>
          <HeaderTitle>Book Details</HeaderTitle>
        </SafeArea>
      </HeaderBackground>

      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        <ContentSection>
          <SharedElement id={`book.${book.id}.cover`}>
            {editMode ? (
              <TouchableOpacity onPress={pickImage}>
                <CoverContainer coverImage={formData.coverImage}>
                  {formData.coverImage ? (
                    <CoverImage source={{ uri: formData.coverImage }} />
                  ) : (
                    <>
                      <Ionicons name="camera" size={48} color="#ffffff" />
                      <CoverTitle>Tap to add cover</CoverTitle>
                    </>
                  )}
                </CoverContainer>
              </TouchableOpacity>
            ) : (
              <CoverContainer coverImage={book.coverImage}>
                {book.coverImage ? (
                  <CoverImage source={{ uri: book.coverImage }} />
                ) : (
                  <>
                    <CoverTitle numberOfLines={3}>{book.title}</CoverTitle>
                    <CoverAuthor numberOfLines={2}>{book.author}</CoverAuthor>
                  </>
                )}
              </CoverContainer>
            )}
          </SharedElement>

          {editMode ? (
            <EditForm>
              <FormInput
                label="Title"
                value={formData.title}
                onChangeText={(text) => handleChange('title', text)}
                error={errors.title}
              />
              
              <FormInput
                label="Author"
                value={formData.author}
                onChangeText={(text) => handleChange('author', text)}
                error={errors.author}
              />
              
              <GenreDropdown
                value={formData.genre}
                onSelect={(genre) => handleChange('genre', genre)}
                error={errors.genre}
              />
              
              <RatingContainer>
                <RatingLabel>Rating</RatingLabel>
                <RatingStars
                  rating={formData.rating}
                  size={30}
                  editable
                  onRatingChange={handleRatingChange}
                />
              </RatingContainer>
              
              <ButtonsRow>
                <Button
                  title="Cancel"
                  onPress={() => setEditMode(false)}
                  variant="outline"
                  style={{ marginRight: 8 }}
                />
                <Button
                  title="Save"
                  onPress={handleSave}
                  loading={saving}
                />
              </ButtonsRow>
            </EditForm>
          ) : (
            <DetailView>
              <SharedElement id={`book.${book.id}.title`}>
                <BookTitle>{book.title}</BookTitle>
              </SharedElement>
              
              <SharedElement id={`book.${book.id}.author`}>
                <BookAuthor>by {book.author}</BookAuthor>
              </SharedElement>

              <RatingRow>
                <RatingStars rating={book.rating || 0} size={24} />
                <RatingNumber>{book.rating || 0}/5</RatingNumber>
              </RatingRow>
              
              {book.genre && (
                <GenreTag>
                  <GenreText>{book.genre}</GenreText>
                </GenreTag>
              )}
              
              <ActionButtons>
                <Button
                  title="Edit"
                  onPress={() => setEditMode(true)}
                  style={{ marginRight: 8 }}
                />
                <Button
                  title="Delete"
                  onPress={handleDelete}
                  variant="danger"
                  loading={deleting}
                />
              </ActionButtons>
            </DetailView>
          )}
        </ContentSection>
      </ScrollView>
      
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onDismiss={() => setToast({ ...toast, visible: false })}
      />
    </Container>
  );
};

BookDetailScreen.sharedElements = (route) => {
  const { bookId } = route.params;
  return [
    {
      id: `book.${bookId}.cover`,
      animation: 'move',
      resize: 'clip',
    },
    {
      id: `book.${bookId}.title`,
      animation: 'fade',
      resize: 'clip',
    },
    {
      id: `book.${bookId}.author`,
      animation: 'fade',
      resize: 'clip',
    },
  ];
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

const HeaderTitle = styled.Text`
  font-size: 28px;
  font-weight: bold;
  color: #212529;
  padding: 16px;
`;

const ContentSection = styled.View`
  padding: 24px;
  align-items: center;
`;

const CoverContainer = styled.View`
  width: ${width * 0.6}px;
  height: ${width * 0.8}px;
  background-color: ${props => props.coverImage ? 'transparent' : '#4ECDC4'};
  border-radius: 20px;
  padding: ${props => props.coverImage ? '0' : '24px'};
  justify-content: center;
  align-items: center;
  shadow-color: #000;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.25;
  shadow-radius: 8px;
  elevation: 8;
  overflow: hidden;
  margin-bottom: 24px;
`;

const CoverImage = styled.Image`
  width: 100%;
  height: 100%;
  resize-mode: cover;
`;

const CoverTitle = styled.Text`
  color: #ffffff;
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 16px;
`;

const CoverAuthor = styled.Text`
  color: rgba(255, 255, 255, 0.8);
  font-size: 18px;
  text-align: center;
`;

const DetailView = styled.View`
  width: 100%;
  align-items: center;
  padding-top: 16px;
`;

const EditForm = styled.View`
  width: 100%;
  padding-top: 16px;
`;

const BookTitle = styled.Text`
  font-size: 28px;
  font-weight: bold;
  color: #212529;
  margin-bottom: 8px;
  text-align: center;
`;

const BookAuthor = styled.Text`
  font-size: 18px;
  color: #495057;
  margin-bottom: 12px;
  text-align: center;
`;

const GenreTag = styled.View`
  background-color: #e9ecef;
  border-radius: 16px;
  padding-horizontal: 12px;
  padding-vertical: 4px;
  margin-bottom: 24px;
`;

const GenreText = styled.Text`
  font-size: 14px;
  color: #495057;
`;

const RatingContainer = styled.View`
  margin-bottom: 32px;
`;

const RatingLabel = styled.Text`
  font-size: 16px;
  color: #495057;
  margin-bottom: 8px;
  font-weight: 500;
`;

const ActionButtons = styled.View`
  flex-direction: row;
  margin-top: 16px;
`;

const ButtonsRow = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  margin-top: 24px;
`;

const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const ErrorContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 16px;
`;

const ErrorText = styled.Text`
  color: #dc3545;
  margin-bottom: 16px;
`;

const RatingRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 16px;
`;

const RatingNumber = styled.Text`
  font-size: 16px;
  color: #495057;
  margin-left: 8px;
  font-weight: 500;
`;

export default BookDetailScreen; 