import React, { useState } from 'react';
import { View, Modal, FlatList, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import { BOOK_GENRES } from '../constants/genres';

const GenreDropdown = ({ value, onSelect, error }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleSelect = (genre) => {
    onSelect(genre);
    setModalVisible(false);
  };

  return (
    <Container>
      <Label>Genre</Label>
      <DropdownButton onPress={() => setModalVisible(true)} error={error}>
        <DropdownText>{value || 'Select a genre'}</DropdownText>
        <Ionicons name="chevron-down" size={20} color="#6c757d" />
      </DropdownButton>
      {error && <ErrorText>{error}</ErrorText>}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <ModalOverlay>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Select Genre</ModalTitle>
              <CloseButton onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#212529" />
              </CloseButton>
            </ModalHeader>
            <FlatList
              data={BOOK_GENRES}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <GenreItem onPress={() => handleSelect(item)}>
                  <GenreItemText>{item}</GenreItemText>
                  {value === item && (
                    <Ionicons name="checkmark" size={20} color="#0d6efd" />
                  )}
                </GenreItem>
              )}
            />
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </Container>
  );
};

const Container = styled.View`
  margin-bottom: 16px;
`;

const Label = styled.Text`
  font-size: 16px;
  color: #495057;
  margin-bottom: 8px;
  font-weight: 500;
`;

const DropdownButton = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background-color: #f8f9fa;
  border-radius: 8px;
  border-width: 1px;
  border-color: ${props => props.error ? '#dc3545' : '#ced4da'};
`;

const DropdownText = styled.Text`
  font-size: 16px;
  color: #212529;
`;

const ErrorText = styled.Text`
  font-size: 14px;
  color: #dc3545;
  margin-top: 4px;
`;

const ModalOverlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: flex-end;
`;

const ModalContent = styled.View`
  background-color: #ffffff;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  max-height: 80%;
`;

const ModalHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom-width: 1px;
  border-bottom-color: #dee2e6;
`;

const ModalTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #212529;
`;

const CloseButton = styled.TouchableOpacity`
  padding: 4px;
`;

const GenreItem = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom-width: 1px;
  border-bottom-color: #dee2e6;
`;

const GenreItemText = styled.Text`
  font-size: 16px;
  color: #212529;
`;

export default GenreDropdown; 