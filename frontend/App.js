import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createSharedElementStackNavigator } from 'react-navigation-shared-element';
import { StatusBar } from 'react-native';
import { AuthProvider } from './src/context/AuthContext';

// Import screens
import LoginScreen from './src/screens/LoginScreen';
import BookListScreen from './src/screens/BookListScreen';
import BookDetailScreen from './src/screens/BookDetailScreen';
import AddBookScreen from './src/screens/AddBookScreen';

const Stack = createSharedElementStackNavigator();

const fadeScreen = ({ current }) => ({
  cardStyle: {
    opacity: current.progress,
  },
});

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        <Stack.Navigator 
          initialRouteName="Login"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#ffffff',
              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 0,
            },
            headerTitleStyle: {
              fontWeight: 'bold',
              fontSize: 18,
              color: '#212529',
            },
            cardStyle: { backgroundColor: '#ffffff' },
            headerBackTitleVisible: false,
            cardOverlayEnabled: true,
            cardStyleInterpolator: fadeScreen,
            gestureEnabled: true,
            transitionSpec: {
              open: { animation: 'timing', config: { duration: 300 } },
              close: { animation: 'timing', config: { duration: 300 } },
            },
          }}
        >
          <Stack.Screen 
            name="Login" 
            component={LoginScreen} 
            options={{ 
              title: 'Libros Libres',
              headerShown: false
            }} 
          />
          <Stack.Screen 
            name="BookList" 
            component={BookListScreen} 
            options={{ 
              title: 'My Books',
              headerLeft: null, // Disable back button
              headerShown: false // Hide header for custom header
            }} 
          />
          <Stack.Screen 
            name="BookDetail" 
            component={BookDetailScreen} 
            options={{ 
              title: 'Book Details',
              headerTransparent: true,
              headerTintColor: '#fff',
              headerBackground: () => null
            }} 
          />
          <Stack.Screen 
            name="AddBook" 
            component={AddBookScreen} 
            options={{ 
              title: 'Add New Book',
              presentation: 'modal',
              cardStyleInterpolator: fadeScreen
            }} 
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
} 