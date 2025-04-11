import React, { useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback, Image } from 'react-native';
import styled from 'styled-components/native';
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

const AddBookScreen = ({ navigation }) => {
  const { author } = useAuth();
  
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: '',
    rating: 0,
    coverImage: null
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });

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

  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
    
    // Clear the error for this field
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

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('author', formData.author);
      formDataToSend.append('genre', formData.genre);
      formDataToSend.append('rating', formData.rating.toString());
      formDataToSend.append('authorId', author.id);
      
      if (formData.coverImage) {
        formDataToSend.append('coverImage', {
          uri: formData.coverImage,
          type: 'image/jpeg',
          name: 'cover.jpg'
        });
      }
      
      await axios.post(`${API_URL}/libros`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      // Show success message
      setToast({
        visible: true,
        message: 'Book added successfully!',
        type: 'success'
      });
      
      // Reset form
      setFormData({
        title: '',
        author: '',
        genre: '',
        rating: 0,
        coverImage: null
      });
      
      // Navigate back after a short delay to ensure the toast is visible
      setTimeout(() => {
        navigation.goBack();
      }, 1000);
      
    } catch (error) {
      console.error('Error adding book:', error);
      setToast({
        visible: true,
        message: 'Failed to add book. Please try again.',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : null}
          style={{ flex: 1 }}
        >
          <ScrollView contentContainerStyle={{ padding: 16 }}>
            <Title>Add New Book</Title>
            
            <CoverImageContainer>
              {formData.coverImage ? (
                <SelectedImage source={{ uri: formData.coverImage }} />
              ) : (
                <PlaceholderContainer>
                  <Ionicons name="image-outline" size={48} color="#6c757d" />
                  <PlaceholderText>Add Book Cover</PlaceholderText>
                </PlaceholderContainer>
              )}
              <UploadButton onPress={pickImage}>
                <UploadButtonText>
                  {formData.coverImage ? 'Change Cover' : 'Upload Cover'}
                </UploadButtonText>
              </UploadButton>
            </CoverImageContainer>
            
            <FormInput
              label="Title"
              value={formData.title}
              onChangeText={(text) => handleChange('title', text)}
              placeholder="Enter book title"
              error={errors.title}
            />
            
            <FormInput
              label="Author"
              value={formData.author}
              onChangeText={(text) => handleChange('author', text)}
              placeholder="Enter author name"
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
            
            <ButtonContainer>
              <Button
                title="Cancel"
                onPress={() => navigation.goBack()}
                variant="outline"
                style={{ marginRight: 12 }}
              />
              <Button
                title="Add Book"
                onPress={handleSubmit}
                loading={loading}
              />
            </ButtonContainer>
          </ScrollView>
        </KeyboardAvoidingView>
        
        <Toast
          visible={toast.visible}
          message={toast.message}
          type={toast.type}
          onDismiss={() => setToast({ ...toast, visible: false })}
        />
      </Container>
    </TouchableWithoutFeedback>
  );
};

const Container = styled.View`
  flex: 1;
  background-color: #ffffff;
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: #212529;
  margin-bottom: 24px;
`;

const CoverImageContainer = styled.View`
  align-items: center;
  margin-bottom: 24px;
`;

const SelectedImage = styled.Image`
  width: 200px;
  height: 300px;
  border-radius: 12px;
  margin-bottom: 12px;
`;

const PlaceholderContainer = styled.View`
  width: 200px;
  height: 300px;
  border-radius: 12px;
  background-color: #f8f9fa;
  justify-content: center;
  align-items: center;
  margin-bottom: 12px;
  border: 2px dashed #dee2e6;
`;

const PlaceholderText = styled.Text`
  color: #6c757d;
  margin-top: 8px;
  font-size: 16px;
`;

const UploadButton = styled.TouchableOpacity`
  background-color: #0d6efd;
  padding: 12px 24px;
  border-radius: 8px;
`;

const UploadButtonText = styled.Text`
  color: #ffffff;
  font-weight: 500;
  font-size: 16px;
`;

const RatingContainer = styled.View`
  margin-bottom: 24px;
`;

const RatingLabel = styled.Text`
  font-size: 16px;
  color: #495057;
  margin-bottom: 8px;
  font-weight: 500;
`;

const ButtonContainer = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  margin-top: 16px;
`;

export default AddBookScreen; 