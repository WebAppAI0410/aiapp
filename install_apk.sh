#!/bin/bash

echo "Japan AI Chat App - APKインストールスクリプト"
echo "================================================"

# Check if ADB is installed
if ! command -v adb &> /dev/null; then
    echo "エラー: ADBがインストールされていません。"
    echo "Android SDKプラットフォームツールをインストールしてください。"
    exit 1
fi

# Check if device is connected
adb devices | grep -q "device$"
if [ $? -ne 0 ]; then
    echo "エラー: 接続されたAndroidデバイスが見つかりません。"
    echo "デバイスをUSBで接続し、USBデバッグが有効になっていることを確認してください。"
    exit 1
fi

# Install the APK
echo "APKをインストールしています..."
adb install -r android/app/build/outputs/apk/debug/app-debug.apk

if [ $? -eq 0 ]; then
    echo "インストール成功！"
    echo "アプリを起動するには、デバイスでJapan AI Chat Appを探してタップしてください。"
else
    echo "インストール失敗。エラーを確認してください。"
fi
