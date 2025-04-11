import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import styled from 'styled-components/native';

const Star = ({ filled, size, onPress }) => {
  return (
    <StarContainer onPress={onPress}>
      <StarIcon size={size} filled={filled}>
        ★
      </StarIcon>
    </StarContainer>
  );
};

const RatingStars = ({ rating = 0, size = 20, editable = false, onRatingChange }) => {
  const renderStars = () => {
    const stars = [];
    
    for (let i = 1; i <= 5; i++) {
      const filled = i <= rating;
      stars.push(
        <Star 
          key={i} 
          filled={filled} 
          size={size}
          onPress={editable ? () => onRatingChange(i) : undefined} 
        />
      );
    }
    
    return stars;
  };

  return (
    <StarsContainer>
      {renderStars()}
    </StarsContainer>
  );
};

const StarsContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

const StarContainer = styled.TouchableOpacity`
  padding: 2px;
`;

const StarIcon = styled.Text`
  font-size: ${props => props.size}px;
  color: ${props => props.filled ? '#ffc107' : '#e9ecef'};
`;

export default RatingStars; 