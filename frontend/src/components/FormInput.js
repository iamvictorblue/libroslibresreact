import React from 'react';
import { TextInput, View, Text } from 'react-native';
import styled from 'styled-components/native';

const FormInput = ({ 
  label, 
  value, 
  onChangeText, 
  placeholder, 
  secureTextEntry, 
  keyboardType,
  error,
  multiline,
  numberOfLines,
  autoCapitalize,
  editable = true
}) => {
  return (
    <InputContainer>
      {label && <Label>{label}</Label>}
      <StyledInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType || 'default'}
        multiline={multiline}
        numberOfLines={numberOfLines}
        autoCapitalize={autoCapitalize || 'sentences'}
        editable={editable}
        hasError={!!error}
      />
      {error && <ErrorText>{error}</ErrorText>}
    </InputContainer>
  );
};

const InputContainer = styled.View`
  margin-bottom: 16px;
  width: 100%;
`;

const Label = styled.Text`
  font-size: 16px;
  color: #495057;
  margin-bottom: 8px;
  font-weight: 500;
`;

const StyledInput = styled.TextInput`
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 12px;
  font-size: 16px;
  color: #212529;
  border-width: 1px;
  border-color: ${props => props.hasError ? '#dc3545' : '#ced4da'};
`;

const ErrorText = styled.Text`
  color: #dc3545;
  font-size: 14px;
  margin-top: 4px;
`;

export default FormInput; 