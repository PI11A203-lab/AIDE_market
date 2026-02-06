# メール設定ガイド

パスワードリセット機能を使用するには、メールサーバー（SMTP）の設定が必要です。

## 1. Nodemailer のインストール

```bash
cd ECSite-server/GIT/ECSite-server
npm install nodemailer
```

## 2. 環境変数の設定

`.env` ファイルを作成または編集し、以下の環境変数を設定してください。

```env
# メール設定 (SMTP) - デフォルト値はコードに設定済み
# パスワードとポートは実際のサーバー設定に合わせて調整してください
SMTP_HOST=kigawa.sakura.ne.jp
SMTP_PORT=587  # 実際のサーバーポート要確認（一般的: 587, 465, 25）
SMTP_SECURE=false  # 587/25 は false、465 は true
SMTP_USER=sumin@kigawa.net
SMTP_PASSWORD=ここに実際のパスワードを入力
SMTP_FROM=sumin@kigawa.net

# フロントエンド URL（メールリンク生成用）
FRONTEND_URL=http://localhost:3000
```

**重要**: `SMTP_PORT` は実際のサーバー設定を確認してください。
- **587**: STARTTLS（最も一般的、推奨）
- **465**: SSL/TLS 暗号化
- **25**: 通常 SMTP（セキュリティは弱い）

sakura.ne.jp のホスティング管理パネルで SMTP ポートを確認するか、メールクライアントの設定を参照してください。

**参考**: デフォルト値はコードに設定済みのため、`.env` には `SMTP_PASSWORD` のみ設定しても構いません。
```env
SMTP_PASSWORD=ここに実際のパスワードを入力
```

## 3. 主なメールサービスの設定例

### Gmail の場合

1. Google アカウントで「アプリパスワード」を発行:
   - Google アカウント設定 → セキュリティ → 2段階認証を有効化
   - アプリパスワードを生成
   - 生成したパスワードを `SMTP_PASSWORD` に使用

2. `.env` の設定:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=生成したアプリパスワード
SMTP_FROM=your-email@gmail.com
```

### Outlook / Hotmail の場合

```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@outlook.com
SMTP_PASSWORD=your-password
SMTP_FROM=your-email@outlook.com
```

### SendGrid の場合

```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASSWORD=your-sendgrid-api-key
SMTP_FROM=noreply@yourdomain.com
```

### Mailgun の場合

```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=postmaster@yourdomain.mailgun.org
SMTP_PASSWORD=your-mailgun-password
SMTP_FROM=noreply@yourdomain.com
```

## 4. 開発環境（メールサーバーなしでテスト）

メールサーバーを設定しなくても、開発環境では動作します。

- メールは送信されませんが、コンソールにトークンとリンクが出力されます
- 開発環境ではトークンが API レスポンスに含まれ、フロントエンドで直接利用できます

## 5. 動作の流れ

### メールサーバーを設定している場合
1. ユーザーがパスワードリセットを要求
2. トークン生成・保存
3. **実際にメール送信**（リセットリンク付き）
4. ユーザーがメールのリンクをクリックしてパスワードをリセット

### メールサーバーを設定していない場合（開発環境）
1. ユーザーがパスワードリセットを要求
2. トークン生成・保存
3. **コンソールにトークン出力**（メールの代わり）
4. API レスポンスにトークンを含める
5. フロントエンドで自動的にリセットページへ遷移

## 6. セキュリティ上の注意

- **`.env` ファイルを Git にコミットしないでください**
- 本番環境では必ず実際のメールサーバーを使用してください
- Gmail 利用時は通常のパスワードではなく「アプリパスワード」を使用してください
- メール送信に失敗しても、ユーザーには成功メッセージを表示します（セキュリティ上の理由）
