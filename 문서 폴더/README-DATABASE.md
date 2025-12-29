# データベース操作ガイド

このドキュメントでは、Docker環境でMySQLデータベースにデータを挿入する方法を説明します。

## 📋 目次

1. [MySQLコマンドラインクライアントで接続](#方法1-mysqlコマンドラインクライアントで接続)
2. [シードスクリプトを使用](#方法2-シードスクリプトを使用推奨)
3. [バックエンドAPI経由](#方法3-バックエンドapi経由)

---

## 方法1: MySQLコマンドラインクライアントで接続

Dockerコンテナ内のMySQLに直接接続して、SQLコマンドを実行できます。

### PowerShellで接続

```powershell
# MySQLコンテナに接続
docker exec -it aide_market_mysql mysql -u aide_user -paide_password aide_market
```

### 接続情報

- **ホスト**: `localhost` (ポート: `3307`)
- **ユーザー名**: `aide_user`
- **パスワード**: `aide_password`
- **データベース名**: `aide_market`

### 使用例

```sql
-- テーブル一覧を表示
SHOW TABLES;

-- Productsテーブルのデータを確認
SELECT * FROM Products;

-- データを挿入
INSERT INTO Products (name, price, seller, description, soldout, download_count, view_count, rating_average, rating_count)
VALUES ('新しい商品', 10000, '販売者名', '商品の説明', 0, 0, 0, 0, 0);

-- データを更新
UPDATE Products SET price = 15000 WHERE id = 1;

-- データを削除
DELETE FROM Products WHERE id = 1;
```

---

## 方法2: シードスクリプトを使用（推奨）

事前に定義された初期データを一括で挿入できます。

### ローカル環境で実行

```powershell
cd ECSite-server/GIT/ECSite-server
npm run seed
```

### Dockerコンテナ内で実行

```powershell
# バックエンドコンテナ内で実行
docker exec -it aide_market_backend node db/seed.js
```

### シードスクリプトの内容

`db/seed.js`には以下の初期データが含まれています：

- **Categories**: 開発ツール、デザインツール、生産性向上
- **Tags**: AI、Web開発、モバイル、デザイン、生産性向上
- **Products**: サンプル商品3件
- **Stats**: 各商品の統計データ
- **Banners**: バナー画像2件

### カスタマイズ

`db/seed.js`を編集して、独自のデータを追加できます。

---

## 方法3: バックエンドAPI経由

既存のAPIエンドポイントを使用してデータを挿入できます。

### 商品を追加

```powershell
# POSTリクエストで商品を追加
curl -X POST http://localhost:8081/api/products `
  -H "Content-Type: application/json" `
  -d '{
    "name": "新しい商品",
    "price": 10000,
    "seller": "販売者名",
    "description": "商品の説明",
    "category_id": 1
  }'
```

### カテゴリを追加

```powershell
curl -X POST http://localhost:8081/api/categories `
  -H "Content-Type: application/json" `
  -d '{
    "name": "新しいカテゴリ",
    "name_ja": "新カテゴリ",
    "description": "カテゴリの説明"
  }'
```

---

## 🔍 データベースの状態を確認

### テーブル一覧を表示

```powershell
docker exec -it aide_market_mysql mysql -u aide_user -paide_password aide_market -e "SHOW TABLES;"
```

### 各テーブルのデータ数を確認

```powershell
docker exec -it aide_market_mysql mysql -u aide_user -paide_password aide_market -e "
SELECT 
    'Products' as table_name, COUNT(*) as count FROM Products
UNION ALL
SELECT 'Categories', COUNT(*) FROM Categories
UNION ALL
SELECT 'Tags', COUNT(*) FROM Tags
UNION ALL
SELECT 'Stats', COUNT(*) FROM Stats
UNION ALL
SELECT 'Banners', COUNT(*) FROM Banners;
"
```

### データをエクスポート

```powershell
# すべてのデータをSQLファイルにエクスポート
docker exec aide_market_mysql mysqldump -u aide_user -paide_password aide_market > backup.sql
```

### データをインポート

```powershell
# SQLファイルからデータをインポート
docker exec -i aide_market_mysql mysql -u aide_user -paide_password aide_market < backup.sql
```

---

## ⚠️ 注意事項

1. **Docker Desktopから直接操作**: Docker DesktopのGUIからはデータベースの内容を直接編集できません。コマンドラインまたはAPIを使用してください。

2. **データの永続化**: データは`mysql_data`ボリュームに保存されます。`docker-compose down -v`を実行すると、データが削除されます。

3. **外部キー制約**: データを挿入する際は、外部キー制約に注意してください（例: `Products`を挿入する前に`Categories`が存在する必要があります）。

---

## 🛠️ トラブルシューティング

### 接続エラーが発生する場合

```powershell
# コンテナが起動しているか確認
docker-compose ps

# MySQLコンテナのログを確認
docker-compose logs mysql
```

### テーブルが存在しない場合

```powershell
# バックエンドサービスを再起動（テーブルが自動的に作成されます）
docker-compose restart backend
```

---

## 📚 関連ファイル

- `db/seed.js`: シードスクリプト
- `db/initializer.js`: データベース初期化
- `app/migrate-data.js`: SQLiteからMySQLへのマイグレーション
- `docker-compose.yml`: Docker設定

