# AIDE Marketチャットボット — Ollama連携設定

チャットボットが **ブラウザからOllama（localhost:11434）に直接リクエスト** するため、Ollama側でCORSを許可する必要があります。

---

## 原因の整理

- CRA（React）開発サーバーの **proxyが `/api/generate` リクエストをOllamaに転送できず** 404が発生していました。
- そのため **proxyではなくブラウザ→Ollama直接呼び出し** 方式に変更し、この場合 **Ollama側のCORS設定が必須** です。

---

## WindowsでのOllama CORS設定

1. **環境変数の追加**
   - `Win + R` → `sysdm.cpl` 入力 → Enter
   - **詳細** タブ → **環境変数**
   - **ユーザー環境変数** または **システム環境変数** で **新規**
   - **変数名**: `OLLAMA_ORIGINS`
   - **変数値**: `*`
   - OKで保存

2. **Ollamaを完全終了してから再起動**
   - タスクトレイのOllamaアイコンを右クリック → 終了
   - またはタスクマネージャーでOllamaプロセスを終了
   - Ollamaアプリを再度起動

3. **動作確認**
   - ブラウザで **http://localhost:11434** にアクセス → "Ollama is running" 表示を確認
   - AIDE Market（localhost:3000）のチャットボットでメッセージ送信 → AI応答受信を確認

---

## まとめ

| 項目 | 内容 |
|------|------|
| **チャットボットのリクエスト方式** | ブラウザ → `http://localhost:11434/api/generate` 直接呼び出し（proxy未使用） |
| **必須設定** | 環境変数 `OLLAMA_ORIGINS=*` を設定後、Ollamaを再起動 |
| **使用モデル** | デフォルト `gemma3:4b`（chatbotApi.jsで変更可能） |
