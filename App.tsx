import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Navigation from './src/navigation';
import { auth } from './src/services/firebase';
import { signInAnonymous } from './src/services/firebase';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const isWeb = typeof document !== 'undefined';
        
        if (isWeb) {
          console.log('Web environment detected, skipping Firebase authentication');
          setIsAuthenticated(true);
          setIsLoading(false);
          return;
        }
        
        if (auth.currentUser) {
          setIsAuthenticated(true);
          setIsLoading(false);
          return;
        }

        await signInAnonymous();
        setIsAuthenticated(true);
      } catch (err) {
        console.error('Authentication error:', err);
        setError('認証エラーが発生しました。もう一度お試しください。');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>読み込み中...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={styles.rootView}>
        <Navigation />
        <StatusBar style="auto" />
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  rootView: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 18,
    color: '#6200ee',
  },
  errorText: {
    fontSize: 16,
    color: '#B00020',
    textAlign: 'center',
  },
});
