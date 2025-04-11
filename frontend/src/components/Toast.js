import React, { useState, useEffect, useRef } from 'react';
import { Animated, Text, View } from 'react-native';
import styled from 'styled-components/native';

const Toast = ({ visible, message, type = 'success', duration = 3000, onDismiss }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [isVisible, setIsVisible] = useState(visible);
  
  useEffect(() => {
    if (visible) {
      setIsVisible(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
      
      const timer = setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          setIsVisible(false);
          if (onDismiss) onDismiss();
        });
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [visible, duration, fadeAnim, onDismiss]);

  if (!isVisible) return null;

  return (
    <ToastContainer style={{ opacity: fadeAnim }} type={type}>
      <ToastText>{message}</ToastText>
    </ToastContainer>
  );
};

const getToastColor = (type) => {
  switch (type) {
    case 'success': return '#198754';
    case 'error': return '#dc3545';
    case 'warning': return '#ffc107';
    case 'info': return '#0dcaf0';
    default: return '#198754';
  }
};

const ToastContainer = styled(Animated.View)`
  position: absolute;
  bottom: 80px;
  left: 20px;
  right: 20px;
  background-color: ${props => getToastColor(props.type)};
  padding: 16px;
  border-radius: 8px;
  flex-direction: row;
  align-items: center;
  shadow-opacity: 0.3;
  shadow-radius: 5px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  elevation: 5;
  z-index: 1000;
`;

const ToastText = styled.Text`
  color: #ffffff;
  font-size: 16px;
  font-weight: 500;
`;

export default Toast; 