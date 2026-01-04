import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from './android/app/src/Navigation/StackNavigator';

export default function App() {
  return (
    <NavigationContainer>
      <StackNavigator />
    </NavigationContainer>
  );
}
