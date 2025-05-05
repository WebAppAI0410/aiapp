import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import ChatScreen from '../screens/ChatScreen';
import ChatListScreen from '../screens/ChatListScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ModelSelectionScreen from '../screens/ModelSelectionScreen';
import SubscriptionScreen from '../screens/SubscriptionScreen';

export type RootStackParamList = {
  ChatList: undefined;
  Chat: { chatId: string } | undefined;
  Settings: undefined;
  ModelSelection: undefined;
  Subscription: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="ChatList"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#6200ee',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="ChatList" 
          component={ChatListScreen} 
          options={{ title: 'チャット一覧' }} 
        />
        <Stack.Screen 
          name="Chat" 
          component={ChatScreen} 
          options={{ title: 'チャット' }} 
        />
        <Stack.Screen 
          name="Settings" 
          component={SettingsScreen} 
          options={{ title: '設定' }} 
        />
        <Stack.Screen 
          name="ModelSelection" 
          component={ModelSelectionScreen} 
          options={{ title: 'AIモデル選択' }} 
        />
        <Stack.Screen 
          name="Subscription" 
          component={SubscriptionScreen} 
          options={{ title: 'サブスクリプション' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
