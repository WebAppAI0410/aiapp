import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform,
  Image,
  ActivityIndicator
} from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation';
import { ChatMessage, Chat } from '../types';
import { sendMessageToOpenRouter, MODELS } from '../services/openRouter';
import { sendMessageToLocalModel } from '../services/localAI';

type ChatScreenRouteProp = RouteProp<RootStackParamList, 'Chat'>;
type ChatScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Chat'>;

const mockChat: Chat = {
  id: '1',
  title: '新しいチャット',
  messages: [],
  createdAt: Date.now(),
  updatedAt: Date.now(),
  model: MODELS.CLOUD.CHATGPT,
};

const ChatScreen = () => {
  const route = useRoute<ChatScreenRouteProp>();
  const navigation = useNavigation<ChatScreenNavigationProp>();
  const [chat, setChat] = useState<Chat>(mockChat);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentModel, setCurrentModel] = useState(MODELS.CLOUD.CHATGPT);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    const chatId = route.params?.chatId;
    if (chatId) {
      setChat(mockChat);
    }
  }, [route.params?.chatId]);

  useEffect(() => {
    if (chat.messages.length > 0 && flatListRef.current) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 200);
    }
  }, [chat.messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputText,
      role: 'user',
      timestamp: Date.now(),
    };

    const updatedMessages = [...chat.messages, userMessage];
    setChat({
      ...chat,
      messages: updatedMessages,
      updatedAt: Date.now(),
    });
    
    setInputText('');
    setIsLoading(true);

    try {
      let assistantMessage;
      
      if (isOfflineMode) {
        const response = await sendMessageToLocalModel(
          updatedMessages,
          MODELS.LOCAL.QWEN
        );
        
        assistantMessage = response;
      } else {
        const response = await sendMessageToOpenRouter(
          updatedMessages,
          currentModel
        );
        
        assistantMessage = response;
      }

      setChat({
        ...chat,
        messages: [...updatedMessages, assistantMessage],
        updatedAt: Date.now(),
      });
    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        content: 'メッセージの送信中にエラーが発生しました。もう一度お試しください。',
        role: 'system',
        timestamp: Date.now(),
      };
      
      setChat({
        ...chat,
        messages: [...updatedMessages, errorMessage],
        updatedAt: Date.now(),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleOfflineMode = () => {
    setIsOfflineMode(!isOfflineMode);
    setCurrentModel(isOfflineMode ? MODELS.CLOUD.CHATGPT : MODELS.LOCAL.QWEN);
  };

  const handleModelSelection = () => {
    navigation.navigate('ModelSelection');
  };

  const renderMessageItem = ({ item }: { item: ChatMessage }) => {
    const isUser = item.role === 'user';
    const isSystem = item.role === 'system';
    
    return (
      <View style={[
        styles.messageContainer,
        isUser ? styles.userMessageContainer : 
        isSystem ? styles.systemMessageContainer : styles.assistantMessageContainer
      ]}>
        {!isUser && !isSystem && (
          <View style={styles.avatarContainer}>
            <Image 
              source={require('../../assets/bot-avatar.png')} 
              style={styles.avatar}
            />
          </View>
        )}
        
        <View style={[
          styles.messageBubble,
          isUser ? styles.userBubble : 
          isSystem ? styles.systemBubble : styles.assistantBubble
        ]}>
          <Text style={[
            styles.messageText,
            isSystem && styles.systemMessageText
          ]}>
            {item.content}
          </Text>
          
          {item.model && (
            <Text style={styles.modelText}>
              {item.model}
            </Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={handleModelSelection} style={styles.modelButton}>
          <Text style={styles.modelButtonText}>
            {isOfflineMode ? 'ローカルモデル' : 'クラウドモデル'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={toggleOfflineMode} style={styles.offlineButton}>
          <Text style={styles.offlineButtonText}>
            {isOfflineMode ? 'オンラインモード' : 'オフラインモード'}
          </Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        ref={flatListRef}
        data={chat.messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessageItem}
        contentContainerStyle={styles.messageList}
      />
      
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6200ee" />
        </View>
      )}
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="メッセージを入力..."
          placeholderTextColor="#999"
          multiline
        />
        <TouchableOpacity 
          style={[styles.sendButton, !inputText.trim() && styles.disabledButton]}
          onPress={handleSendMessage}
          disabled={!inputText.trim() || isLoading}
        >
          <Text style={styles.sendButtonText}>送信</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  modelButton: {
    backgroundColor: '#6200ee',
    padding: 8,
    borderRadius: 16,
  },
  modelButtonText: {
    color: '#fff',
    fontSize: 12,
  },
  offlineButton: {
    backgroundColor: '#03dac6',
    padding: 8,
    borderRadius: 16,
  },
  offlineButtonText: {
    color: '#000',
    fontSize: 12,
  },
  messageList: {
    padding: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  userMessageContainer: {
    justifyContent: 'flex-end',
  },
  assistantMessageContainer: {
    justifyContent: 'flex-start',
  },
  systemMessageContainer: {
    justifyContent: 'center',
  },
  avatarContainer: {
    marginRight: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  messageBubble: {
    maxWidth: '70%',
    padding: 12,
    borderRadius: 16,
  },
  userBubble: {
    backgroundColor: '#6200ee',
    borderBottomRightRadius: 4,
  },
  assistantBubble: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,
  },
  systemBubble: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  messageText: {
    fontSize: 16,
    color: '#000',
  },
  systemMessageText: {
    color: '#666',
    fontStyle: 'italic',
  },
  modelText: {
    fontSize: 10,
    color: '#666',
    marginTop: 4,
    textAlign: 'right',
  },
  loadingContainer: {
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 8,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  input: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#6200ee',
    borderRadius: 20,
    width: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ChatScreen;
