import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Switch, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation';
import { AIModel } from '../types';
import { MODELS } from '../services/openRouter';
import { isModelDownloaded, downloadModel } from '../services/localAI';

type ModelSelectionScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ModelSelection'>;

const mockModels: AIModel[] = [
  {
    id: '1',
    name: 'ChatGPT',
    provider: 'openai',
    isLocal: false,
    dailyLimit: 10,
    usageCount: 0,
  },
  {
    id: '2',
    name: 'Claude',
    provider: 'anthropic',
    isLocal: false,
    dailyLimit: 5,
    usageCount: 0,
  },
  {
    id: '3',
    name: 'Deepseek',
    provider: 'deepseek',
    isLocal: false,
    dailyLimit: 15,
    usageCount: 0,
  },
  {
    id: '4',
    name: 'Qwen3:4B',
    provider: 'qwen',
    isLocal: true,
    isDownloaded: false,
    downloadProgress: 0,
  },
];

const ModelSelectionScreen = () => {
  const navigation = useNavigation<ModelSelectionScreenNavigationProp>();
  const [models, setModels] = useState<AIModel[]>(mockModels);
  const [selectedModelId, setSelectedModelId] = useState<string>('1');
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  useEffect(() => {
    const checkLocalModels = async () => {
      const updatedModels = [...models];
      
      for (let i = 0; i < updatedModels.length; i++) {
        const model = updatedModels[i];
        
        if (model.isLocal) {
          const downloaded = await isModelDownloaded(model.name);
          model.isDownloaded = downloaded;
        }
      }
      
      setModels(updatedModels);
    };
    
    checkLocalModels();
  }, []);

  const handleModelSelect = (modelId: string) => {
    setSelectedModelId(modelId);
    
  };

  const handleModelDownload = async (model: AIModel) => {
    if (isDownloading) return;
    
    setIsDownloading(true);
    
    try {
      const updatedModels = [...models];
      const modelIndex = updatedModels.findIndex(m => m.id === model.id);
      
      if (modelIndex !== -1) {
        const updateProgress = (progress: number) => {
          const newModels = [...updatedModels];
          newModels[modelIndex].downloadProgress = progress;
          setModels(newModels);
        };
        
        const success = await downloadModel(model.name, updateProgress);
        
        if (success) {
          updatedModels[modelIndex].isDownloaded = true;
          Alert.alert('ダウンロード完了', `${model.name}のダウンロードが完了しました。`);
        } else {
          Alert.alert('エラー', `${model.name}のダウンロード中にエラーが発生しました。`);
        }
        
        setModels(updatedModels);
      }
    } catch (error) {
      console.error('Error downloading model:', error);
      Alert.alert('エラー', 'モデルのダウンロード中にエラーが発生しました。');
    } finally {
      setIsDownloading(false);
    }
  };

  const renderModelItem = ({ item }: { item: AIModel }) => {
    const isSelected = item.id === selectedModelId;
    const isDownloaded = item.isDownloaded;
    const modelIsDownloading = isDownloading && item.downloadProgress !== undefined && item.downloadProgress < 100;
    
    return (
      <TouchableOpacity
        style={[styles.modelItem, isSelected && styles.selectedModelItem]}
        onPress={() => handleModelSelect(item.id)}
        disabled={item.isLocal && !isDownloaded}
      >
        <View style={styles.modelInfo}>
          <Text style={styles.modelName}>{item.name}</Text>
          <Text style={styles.modelProvider}>{item.provider}</Text>
          
          {item.dailyLimit && (
            <Text style={styles.modelLimit}>
              1日の制限: {item.dailyLimit}回 (使用済み: {item.usageCount || 0}回)
            </Text>
          )}
          
          {item.isLocal && (
            <View style={styles.downloadContainer}>
              {isDownloaded ? (
                <Text style={styles.downloadedText}>ダウンロード済み</Text>
              ) : isDownloading ? (
                <View style={styles.progressContainer}>
                  <View 
                    style={[
                      styles.progressBar, 
                      { width: item.downloadProgress ? `${item.downloadProgress}%` : '0%' }
                    ]} 
                  />
                  <Text style={styles.progressText}>{item.downloadProgress}%</Text>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.downloadButton}
                  onPress={() => handleModelDownload(item)}
                >
                  <Text style={styles.downloadButtonText}>ダウンロード</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
        
        {!item.isLocal || isDownloaded ? (
          <View style={styles.radioContainer}>
            <View style={[styles.radioOuter, isSelected && styles.radioOuterSelected]}>
              {isSelected && <View style={styles.radioInner} />}
            </View>
          </View>
        ) : null}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AIモデル選択</Text>
      
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>クラウドモデル</Text>
        <Text style={styles.sectionDescription}>
          インターネット接続が必要です。無料プランでは1日の使用回数に制限があります。
        </Text>
        
        <FlatList
          data={models.filter(model => !model.isLocal)}
          keyExtractor={(item) => item.id}
          renderItem={renderModelItem}
          contentContainerStyle={styles.modelList}
        />
      </View>
      
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>ローカルモデル</Text>
        <Text style={styles.sectionDescription}>
          デバイスにダウンロードして、オフラインでも使用できます。
        </Text>
        
        <FlatList
          data={models.filter(model => model.isLocal)}
          keyExtractor={(item) => item.id}
          renderItem={renderModelItem}
          contentContainerStyle={styles.modelList}
        />
      </View>
      
      <TouchableOpacity
        style={styles.subscriptionButton}
        onPress={() => navigation.navigate('Subscription')}
      >
        <Text style={styles.subscriptionButtonText}>
          サブスクリプションでより多くのモデルと無制限の使用回数を利用する
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  modelList: {
    marginBottom: 16,
  },
  modelItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  selectedModelItem: {
    borderColor: '#6200ee',
    borderWidth: 2,
  },
  modelInfo: {
    flex: 1,
  },
  modelName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  modelProvider: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  modelLimit: {
    fontSize: 12,
    color: '#666',
  },
  downloadContainer: {
    marginTop: 8,
  },
  downloadButton: {
    backgroundColor: '#03dac6',
    padding: 8,
    borderRadius: 4,
    alignItems: 'center',
    width: 120,
  },
  downloadButtonText: {
    color: '#000',
    fontWeight: 'bold',
  },
  downloadedText: {
    color: '#4caf50',
    fontWeight: 'bold',
  },
  progressContainer: {
    height: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 4,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#03dac6',
  },
  progressText: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 12,
    fontWeight: 'bold',
  },
  radioContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
  },
  radioOuter: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#6200ee',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterSelected: {
    borderColor: '#6200ee',
  },
  radioInner: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: '#6200ee',
  },
  subscriptionButton: {
    backgroundColor: '#6200ee',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  subscriptionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ModelSelectionScreen;
