import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import styled from 'styled-components/native';

const FAB = ({ onPress, icon = '+', color = '#0d6efd', size = 60 }) => {
  return (
    <FABContainer onPress={onPress} color={color} size={size}>
      <FABText size={size / 2}>{icon}</FABText>
    </FABContainer>
  );
};

const FABContainer = styled.TouchableOpacity`
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  border-radius: ${props => props.size / 2}px;
  background-color: ${props => props.color};
  position: absolute;
  bottom: 24px;
  right: 24px;
  justify-content: center;
  align-items: center;
  elevation: 5;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
`;

const FABText = styled.Text`
  font-size: ${props => props.size}px;
  color: white;
  font-weight: bold;
  text-align: center;
  margin-top: -2px;
`;

export default FAB; 