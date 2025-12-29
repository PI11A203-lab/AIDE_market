# Docker セットアップガイド

このプロジェクトをDockerで実行するための手順です。

## 前提条件

- Docker Desktop がインストールされていること
- Docker Compose が利用可能であること

## セットアップ手順

### 1. 環境変数の設定（オプション）

必要に応じて、`.env`ファイルを作成して環境変数を設定できます：

```env
# MySQL設定
MYSQL_ROOT_PASSWORD=root
MYSQL_DATABASE=aide_market
MYSQL_USER=aide_user
MYSQL_PASSWORD=aide_password

# バックエンド設定
DB_HOST=mysql
DB_USERNAME=aide_user
DB_PASSWORD=aide_password
DB_NAME=aide_market
```

### 2. Docker Composeで起動

プロジェクトのルートディレクトリで以下のコマンドを実行：

```bash
# イメージのビルドとコンテナの起動
docker-compose up -d --build

# ログを確認
docker-compose logs -f

# 特定のサービスのログを確認
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mysql
```

### 3. アクセス

- **フロントエンド**: http://localhost:3000
- **バックエンドAPI**: http://localhost:8081
- **MySQL**: localhost:3306

### 4. 停止とクリーンアップ

```bash
# コンテナの停止
docker-compose down

# ボリュームも含めて完全に削除
docker-compose down -v

# イメージも削除
docker-compose down -v --rmi all
```

## サービス構成

- **mysql**: MySQL 8.0 データベース
- **backend**: Node.js/Express API サーバー（ポート8081）
- **frontend**: React アプリケーション（Nginx経由、ポート3000）

## トラブルシューティング

### データベース接続エラー

バックエンドがMySQLに接続できない場合：

1. MySQLコンテナが正常に起動しているか確認：
   ```bash
   docker-compose ps
   ```

2. MySQLのログを確認：
   ```bash
   docker-compose logs mysql
   ```

3. バックエンドの環境変数が正しく設定されているか確認

### フロントエンドがバックエンドに接続できない

1. バックエンドが正常に起動しているか確認：
   ```bash
   docker-compose logs backend
   ```

2. ネットワーク接続を確認：
   ```bash
   docker network inspect aide_market_aide_market_network
   ```

### ポートが既に使用されている

ポート3000、8081、3306が既に使用されている場合、`docker-compose.yml`のポート設定を変更してください。

## 開発モード

開発中は、以下のコマンドで個別にサービスを起動することもできます：

```bash
# バックエンドのみ起動
docker-compose up backend mysql

# フロントエンドのみ起動
docker-compose up frontend
```

## データベースの初期化

初回起動時、MySQLコンテナが自動的にデータベースを作成します。
バックエンドサーバーが起動すると、Sequelizeが自動的にテーブルを作成します。

## ファイルアップロード

アップロードされたファイルは `ECSite-server/GIT/ECSite-server/uploads` ディレクトリに保存されます。
このディレクトリはDockerボリュームとしてマウントされているため、コンテナを再起動してもデータは保持されます。

