import React from 'react';
import { View, Text, TouchableOpacity, Dimensions, Image } from 'react-native';
import styled from 'styled-components/native';
import { SharedElement } from 'react-navigation-shared-element';
import { LinearGradient } from 'expo-linear-gradient';
import RatingStars from './RatingStars';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 80) / 2;

const getRandomGradient = () => {
  const gradients = [
    ['#FF6B6B', '#FF8787'],
    ['#4ECDC4', '#45B7D1'],
    ['#96CEB4', '#FFEEAD'],
    ['#D4A5A5', '#FFEEAD'],
    ['#9B786F', '#D7BBA8'],
    ['#A8E6CF', '#DCEDC1'],
    ['#FFD3B6', '#FFAAA5'],
  ];
  return gradients[Math.floor(Math.random() * gradients.length)];
};

const BookCard = ({ book, onPress }) => {
  const [startColor, endColor] = React.useMemo(() => getRandomGradient(), []);

  return (
    <CardContainer onPress={onPress}>
      <SharedElement id={`book.${book.id}.cover`}>
        <CoverContainer>
          {book.coverImage ? (
            <CoverImage source={{ uri: book.coverImage }} />
          ) : (
            <LinearGradient
              colors={[startColor, endColor]}
              style={{
                width: '100%',
                height: '100%',
                borderRadius: 16,
                padding: 16,
                justifyContent: 'space-between',
              }}
            >
              <SharedElement id={`book.${book.id}.title`}>
                <Title numberOfLines={3}>{book.title}</Title>
              </SharedElement>
              
              <SharedElement id={`book.${book.id}.author`}>
                <Author numberOfLines={2}>{book.author}</Author>
              </SharedElement>
            </LinearGradient>
          )}
        </CoverContainer>
      </SharedElement>
      <BookInfo>
        <BookTitle numberOfLines={2}>{book.title}</BookTitle>
        <BookAuthor numberOfLines={1}>{book.author}</BookAuthor>
        <RatingRow>
          <RatingStars rating={book.rating || 0} size={14} />
          <RatingNumber>{book.rating || 0}/5</RatingNumber>
        </RatingRow>
      </BookInfo>
    </CardContainer>
  );
};

const CardContainer = styled.TouchableOpacity`
  width: ${CARD_WIDTH}px;
  margin-bottom: 24px;
  margin-right: 16px;
`;

const CoverContainer = styled.View`
  width: 100%;
  height: ${CARD_WIDTH * 1.5}px;
  border-radius: 16px;
  overflow: hidden;
  shadow-color: #000;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.2;
  shadow-radius: 8px;
  elevation: 5;
  margin-bottom: 8px;
  background-color: #f8f9fa;
`;

const CoverImage = styled.Image`
  width: 100%;
  height: 100%;
  resize-mode: cover;
`;

const Title = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #ffffff;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.1);
`;

const Author = styled.Text`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.1);
`;

const BookInfo = styled.View`
  padding-horizontal: 4px;
`;

const BookTitle = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: #212529;
  margin-bottom: 2px;
`;

const BookAuthor = styled.Text`
  font-size: 12px;
  color: #6c757d;
  margin-bottom: 4px;
`;

const RatingRow = styled.View`
  flex-direction: row;
  align-items: center;
`;

const RatingNumber = styled.Text`
  font-size: 12px;
  color: #495057;
  margin-left: 4px;
  font-weight: 500;
`;

export default BookCard; 