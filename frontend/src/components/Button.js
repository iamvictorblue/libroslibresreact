import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import styled from 'styled-components/native';

const Button = ({ 
  title, 
  onPress, 
  variant = 'primary', 
  disabled = false,
  loading = false,
  fullWidth = false
}) => {
  return (
    <ButtonContainer 
      onPress={onPress} 
      disabled={disabled || loading} 
      variant={variant}
      fullWidth={fullWidth}
    >
      {loading ? (
        <ActivityIndicator color="#ffffff" size="small" />
      ) : (
        <ButtonText variant={variant}>{title}</ButtonText>
      )}
    </ButtonContainer>
  );
};

const getBackgroundColor = (variant, disabled) => {
  if (disabled) return '#e9ecef';
  
  switch (variant) {
    case 'primary': return '#0d6efd';
    case 'secondary': return '#6c757d';
    case 'success': return '#198754';
    case 'danger': return '#dc3545';
    case 'outline': return 'transparent';
    default: return '#0d6efd';
  }
};

const getTextColor = (variant, disabled) => {
  if (disabled) return '#6c757d';
  
  switch (variant) {
    case 'outline': return '#0d6efd';
    default: return '#ffffff';
  }
};

const getBorderColor = (variant) => {
  switch (variant) {
    case 'outline': return '#0d6efd';
    default: return 'transparent';
  }
};

const ButtonContainer = styled.TouchableOpacity`
  background-color: ${props => getBackgroundColor(props.variant, props.disabled)};
  padding-vertical: 12px;
  padding-horizontal: 20px;
  border-radius: 8px;
  align-items: center;
  justify-content: center;
  width: ${props => props.fullWidth ? '100%' : 'auto'};
  border-width: ${props => props.variant === 'outline' ? '1px' : '0px'};
  border-color: ${props => getBorderColor(props.variant)};
  opacity: ${props => props.disabled ? 0.7 : 1};
`;

const ButtonText = styled.Text`
  color: ${props => getTextColor(props.variant, props.disabled)};
  font-size: 16px;
  font-weight: 600;
`;

export default Button; 