import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation';
import { AppSettings } from '../types';

type SettingsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Settings'>;

const defaultSettings: AppSettings = {
  language: 'ja',
  theme: 'light',
  fontSize: 'medium',
  notifications: true,
  useCharacterAvatar: false,
};

const SettingsScreen = () => {
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);

  const toggleNotifications = () => {
    setSettings({
      ...settings,
      notifications: !settings.notifications,
    });
  };

  const toggleCharacterAvatar = () => {
    setSettings({
      ...settings,
      useCharacterAvatar: !settings.useCharacterAvatar,
    });
  };

  const changeLanguage = (language: 'ja' | 'en' | 'zh' | 'ko') => {
    setSettings({
      ...settings,
      language,
    });
  };

  const changeTheme = (theme: 'light' | 'dark' | 'system') => {
    setSettings({
      ...settings,
      theme,
    });
  };

  const changeFontSize = (fontSize: 'small' | 'medium' | 'large') => {
    setSettings({
      ...settings,
      fontSize,
    });
  };

  const handleSubscriptionPress = () => {
    navigation.navigate('Subscription');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>言語設定</Text>
        <View style={styles.optionContainer}>
          <TouchableOpacity
            style={[styles.optionButton, settings.language === 'ja' && styles.selectedOption]}
            onPress={() => changeLanguage('ja')}
          >
            <Text style={styles.optionText}>日本語</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.optionButton, settings.language === 'en' && styles.selectedOption]}
            onPress={() => changeLanguage('en')}
          >
            <Text style={styles.optionText}>English</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.optionButton, settings.language === 'zh' && styles.selectedOption]}
            onPress={() => changeLanguage('zh')}
          >
            <Text style={styles.optionText}>中文</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.optionButton, settings.language === 'ko' && styles.selectedOption]}
            onPress={() => changeLanguage('ko')}
          >
            <Text style={styles.optionText}>한국어</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>テーマ</Text>
        <View style={styles.optionContainer}>
          <TouchableOpacity
            style={[styles.optionButton, settings.theme === 'light' && styles.selectedOption]}
            onPress={() => changeTheme('light')}
          >
            <Text style={styles.optionText}>ライト</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.optionButton, settings.theme === 'dark' && styles.selectedOption]}
            onPress={() => changeTheme('dark')}
          >
            <Text style={styles.optionText}>ダーク</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.optionButton, settings.theme === 'system' && styles.selectedOption]}
            onPress={() => changeTheme('system')}
          >
            <Text style={styles.optionText}>システム設定に従う</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>文字サイズ</Text>
        <View style={styles.optionContainer}>
          <TouchableOpacity
            style={[styles.optionButton, settings.fontSize === 'small' && styles.selectedOption]}
            onPress={() => changeFontSize('small')}
          >
            <Text style={styles.optionText}>小</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.optionButton, settings.fontSize === 'medium' && styles.selectedOption]}
            onPress={() => changeFontSize('medium')}
          >
            <Text style={styles.optionText}>中</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.optionButton, settings.fontSize === 'large' && styles.selectedOption]}
            onPress={() => changeFontSize('large')}
          >
            <Text style={styles.optionText}>大</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>通知</Text>
        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>通知を有効にする</Text>
          <Switch
            value={settings.notifications}
            onValueChange={toggleNotifications}
            trackColor={{ false: '#ccc', true: '#6200ee' }}
            thumbColor={settings.notifications ? '#fff' : '#f4f3f4'}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>キャラクター設定</Text>
        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>キャラクターアバターを使用する</Text>
          <Switch
            value={settings.useCharacterAvatar}
            onValueChange={toggleCharacterAvatar}
            trackColor={{ false: '#ccc', true: '#6200ee' }}
            thumbColor={settings.useCharacterAvatar ? '#fff' : '#f4f3f4'}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>サブスクリプション</Text>
        <TouchableOpacity
          style={styles.subscriptionButton}
          onPress={handleSubscriptionPress}
        >
          <Text style={styles.subscriptionButtonText}>サブスクリプション管理</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>アプリ情報</Text>
        <Text style={styles.infoText}>バージョン: 1.0.0</Text>
        <Text style={styles.infoText}>© 2025 Japan AI Chat App</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  section: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  optionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  optionButton: {
    backgroundColor: '#f0f0f0',
    padding: 8,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedOption: {
    backgroundColor: '#6200ee',
  },
  optionText: {
    fontSize: 16,
    color: '#000',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switchLabel: {
    fontSize: 16,
  },
  subscriptionButton: {
    backgroundColor: '#03dac6',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  subscriptionButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
});

export default SettingsScreen;
