import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  period: 'monthly' | 'yearly';
  features: string[];
  recommended?: boolean;
}

const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'free',
    name: '無料プラン',
    price: 0,
    currency: 'JPY',
    period: 'monthly',
    features: [
      'クラウドモデル (1日の制限あり)',
      'ローカルモデル (Qwen3:4B)',
      'チャット履歴の保存',
      '基本的なチャットUI',
    ],
  },
  {
    id: 'basic',
    name: 'ベーシックプラン',
    price: 980,
    currency: 'JPY',
    period: 'monthly',
    features: [
      'クラウドモデル (1日の制限なし)',
      'ローカルモデル (Qwen3:4B)',
      'チャット履歴の保存',
      '基本的なチャットUI',
      '優先サポート',
    ],
    recommended: true,
  },
  {
    id: 'premium',
    name: 'プレミアムプラン',
    price: 1980,
    currency: 'JPY',
    period: 'monthly',
    features: [
      'クラウドモデル (1日の制限なし)',
      'ローカルモデル (Qwen3:4B)',
      'チャット履歴の保存',
      'LIVE2D/AIキャラクター',
      '画像生成機能',
      '優先サポート',
      '新機能の早期アクセス',
    ],
  },
];

const SubscriptionScreen = () => {
  const navigation = useNavigation();
  const [selectedPlanId, setSelectedPlanId] = useState<string>('free');

  const formatPrice = (price: number, currency: string): string => {
    if (price === 0) return '無料';
    
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleSubscribe = () => {
    const selectedPlan = subscriptionPlans.find(plan => plan.id === selectedPlanId);
    
    if (!selectedPlan || selectedPlan.id === 'free') {
      navigation.goBack();
      return;
    }
    
    Alert.alert(
      'サブスクリプション確認',
      `${selectedPlan.name} (${formatPrice(selectedPlan.price, selectedPlan.currency)}/${selectedPlan.period === 'monthly' ? '月' : '年'}) に登録しますか？`,
      [
        {
          text: 'キャンセル',
          style: 'cancel',
        },
        {
          text: '登録する',
          onPress: () => {
            Alert.alert(
              'サブスクリプション完了',
              `${selectedPlan.name}に登録しました。ありがとうございます！`,
              [
                {
                  text: 'OK',
                  onPress: () => navigation.goBack(),
                },
              ]
            );
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>サブスクリプションプラン</Text>
      <Text style={styles.subtitle}>
        あなたに最適なプランを選択してください
      </Text>
      
      {subscriptionPlans.map((plan) => (
        <TouchableOpacity
          key={plan.id}
          style={[
            styles.planCard,
            selectedPlanId === plan.id && styles.selectedPlanCard,
            plan.recommended && styles.recommendedPlanCard,
          ]}
          onPress={() => setSelectedPlanId(plan.id)}
        >
          {plan.recommended && (
            <View style={styles.recommendedBadge}>
              <Text style={styles.recommendedText}>おすすめ</Text>
            </View>
          )}
          
          <Text style={styles.planName}>{plan.name}</Text>
          
          <View style={styles.priceContainer}>
            <Text style={styles.planPrice}>
              {formatPrice(plan.price, plan.currency)}
            </Text>
            <Text style={styles.planPeriod}>
              /{plan.period === 'monthly' ? '月' : '年'}
            </Text>
          </View>
          
          <View style={styles.featuresContainer}>
            {plan.features.map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <Text style={styles.featureText}>✓ {feature}</Text>
              </View>
            ))}
          </View>
          
          <View style={styles.radioContainer}>
            <View style={[styles.radioOuter, selectedPlanId === plan.id && styles.radioOuterSelected]}>
              {selectedPlanId === plan.id && <View style={styles.radioInner} />}
            </View>
          </View>
        </TouchableOpacity>
      ))}
      
      <TouchableOpacity
        style={styles.subscribeButton}
        onPress={handleSubscribe}
      >
        <Text style={styles.subscribeButtonText}>
          {selectedPlanId === 'free' ? '無料プランを使用する' : '今すぐ登録する'}
        </Text>
      </TouchableOpacity>
      
      <Text style={styles.termsText}>
        登録することで、利用規約とプライバシーポリシーに同意したことになります。
        サブスクリプションはいつでもキャンセルできます。
      </Text>
    </ScrollView>
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
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  planCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
  },
  selectedPlanCard: {
    borderColor: '#6200ee',
    borderWidth: 2,
  },
  recommendedPlanCard: {
    borderColor: '#03dac6',
    borderWidth: 2,
  },
  recommendedBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#03dac6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderTopRightRadius: 12,
    borderBottomLeftRadius: 12,
  },
  recommendedText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 12,
  },
  planName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 16,
  },
  planPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6200ee',
  },
  planPeriod: {
    fontSize: 16,
    color: '#666',
    marginLeft: 4,
  },
  featuresContainer: {
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    color: '#333',
  },
  radioContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
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
  subscribeButton: {
    backgroundColor: '#6200ee',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  subscribeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  termsText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
});

export default SubscriptionScreen;
