import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation';
import { Chat } from '../types';

type ChatListScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ChatList'>;

const mockChats: Chat[] = [
  {
    id: '1',
    title: '新しいチャット',
    messages: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];

const ChatListScreen = () => {
  const navigation = useNavigation<ChatListScreenNavigationProp>();
  const [chats, setChats] = useState<Chat[]>(mockChats);

  const handleChatPress = (chatId: string) => {
    navigation.navigate('Chat', { chatId });
  };

  const handleNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: '新しいチャット',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    
    setChats([newChat, ...chats]);
    navigation.navigate('Chat', { chatId: newChat.id });
  };

  const handleSettingsPress = () => {
    navigation.navigate('Settings');
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('ja-JP');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>AIチャット</Text>
        <TouchableOpacity onPress={handleSettingsPress} style={styles.settingsButton}>
          <Text style={styles.settingsButtonText}>設定</Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity onPress={handleNewChat} style={styles.newChatButton}>
        <Text style={styles.newChatButtonText}>新しいチャットを作成</Text>
      </TouchableOpacity>
      
      <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.chatItem}
            onPress={() => handleChatPress(item.id)}
          >
            <Text style={styles.chatTitle}>{item.title}</Text>
            <Text style={styles.chatDate}>{formatDate(item.updatedAt)}</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#6200ee',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  settingsButton: {
    padding: 8,
  },
  settingsButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  newChatButton: {
    backgroundColor: '#03dac6',
    padding: 16,
    margin: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  newChatButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  listContent: {
    padding: 16,
  },
  chatItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  chatTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  chatDate: {
    fontSize: 14,
    color: '#666',
  },
});

export default ChatListScreen;
