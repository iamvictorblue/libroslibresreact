import React, { useState, useEffect } from 'react';
import { Image, Keyboard, KeyboardAvoidingView, Platform, TouchableWithoutFeedback } from 'react-native';
import styled from 'styled-components/native';
import { useAuth } from '../context/AuthContext';
import FormInput from '../components/FormInput';
import Button from '../components/Button';
import Toast from '../components/Toast';

const LoginScreen = ({ navigation }) => {
  const { login, isLoggedIn } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });

  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn) {
      navigation.replace('BookList');
    }
  }, [isLoggedIn, navigation]);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleLogin = async () => {
    // Reset error
    setError('');
    
    // Validate email
    if (!email) {
      setError('Email is required');
      return;
    }
    
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    try {
      setLoading(true);
      await login(email);
      setToast({
        visible: true,
        message: 'Login successful!',
        type: 'success'
      });
      
      // Navigation handled by useEffect watching isLoggedIn
    } catch (error) {
      console.error('Login failed:', error);
      setToast({
        visible: true,
        message: 'Login failed. Please try again.',
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
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1, justifyContent: 'center' }}
        >
          <LogoContainer>
            <Logo source={require('../../assets/book-logo.png')} />
            <AppTitle>Libros Libres</AppTitle>
            <Tagline>Manage your books with ease</Tagline>
          </LogoContainer>
          
          <FormContainer>
            <FormInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              error={error}
            />
            
            <Button
              title="Login / Sign Up"
              onPress={handleLogin}
              loading={loading}
              fullWidth
            />
          </FormContainer>
          
          <LegalText>
            By continuing, you agree to the Terms of Service and Privacy Policy
          </LegalText>
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
  padding: 20px;
`;

const LogoContainer = styled.View`
  align-items: center;
  margin-bottom: 40px;
`;

const Logo = styled.Image`
  width: 100px;
  height: 100px;
  margin-bottom: 16px;
`;

const AppTitle = styled.Text`
  font-size: 28px;
  font-weight: bold;
  color: #212529;
  margin-bottom: 8px;
`;

const Tagline = styled.Text`
  font-size: 16px;
  color: #6c757d;
`;

const FormContainer = styled.View`
  margin-bottom: 24px;
`;

const LegalText = styled.Text`
  text-align: center;
  color: #6c757d;
  font-size: 12px;
`;

export default LoginScreen; 