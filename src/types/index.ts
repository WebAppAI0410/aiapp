export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  timestamp: number;
  model?: string;
  imageUrl?: string;
}

export interface User {
  id: string;
  isAnonymous: boolean;
  subscription?: Subscription;
}

export interface Subscription {
  tier: 'free' | 'basic' | 'premium';
  startDate: number;
  endDate: number;
  paymentHistory: Payment[];
}

export interface Payment {
  id: string;
  amount: number;
  currency: string;
  date: number;
  status: 'success' | 'pending' | 'failed';
}

export interface Chat {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
  model?: string;
}

export interface AIModel {
  id: string;
  name: string;
  provider: 'openai' | 'anthropic' | 'deepseek' | 'qwen';
  isLocal: boolean;
  isDownloaded?: boolean;
  downloadProgress?: number;
  dailyLimit?: number;
  usageCount?: number;
}

export interface AppSettings {
  language: 'ja' | 'en' | 'zh' | 'ko';
  theme: 'light' | 'dark' | 'system';
  fontSize: 'small' | 'medium' | 'large';
  notifications: boolean;
  useCharacterAvatar: boolean;
  selectedCharacter?: string;
}
