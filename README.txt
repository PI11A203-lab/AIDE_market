================================================================================
                          AIDE Market（AIDEマーケット）
                    AIマーケットプレイス - プロジェクト紹介ドキュメント
================================================================================

■ 概要
--------------------------------------------------------------------------------
AIDE Marketは、AIエージェント／ツールを商品として取引する電子商取引プラットフォームです。
Reactベースのフロントエンド、Node.js/Expressバックエンド、MySQLデータベースで構成された
フルスタックWebアプリケーションであり、Docker Composeで一括起動できます。

- プロジェクト名: AIDE Market（AIDEmarket）
- 構成: フロントエンド(React) + バックエンド(Express) + DB(MySQL)
- デプロイ: Dockerコンテナ基盤（オプションでCloudflare Workers等の静的デプロイも可能）


■ システムアーキテクチャ
--------------------------------------------------------------------------------
[クライアント]  →  [フロントエンド :3000]  →  [バックエンドAPI :8081]  →  [MySQL :3307]
                    (React + Nginx)         (Node.js/Express)      (MySQL 8.0)

- フロントエンド: React 17, React Router, Ant Design, Tailwind CSS, Chart.js/Recharts
- バックエンド: Express 5, Sequelize(MySQL2), Passport(セッション・Google OAuth), JWT
- DB: MySQL 8.0（Sequelize ORM）
- ファイルアップロード: Multer（画像/文書）、/uploads 静的配信


■ ディレクトリ構造（概要）
--------------------------------------------------------------------------------
AIDEmarket/
├── docker-compose.yml          # MySQL, Backend, Frontend コンテナ定義
├── ECSite-server/              # バックエンドサーバー
│   └── GIT/ECSite-server/
│       ├── app/
│       │   ├── server.js       # Express アプリエントリポイント
│       │   └── routes.js       # APIルート登録
│       ├── config/             # DB等の設定
│       ├── db/                 # Sequelize初期化、シード、マイグレーション
│       ├── features/           # ドメイン別機能（product, order, auth, admin等）
│       ├── middleware/         # 認証、IPブロック、Rate Limit、ボット検知等
│       ├── routes/             # adminルート
│       ├── jobs/               # 定期ジョブ（購読決済、通知、ログ整理等）
│       └── uploads/            # アップロードファイル（商品画像、学生証等）
│
├── Electronic-Commerce-Site/
│   └── grab-market-web/        # フロントエンド（React）
│       ├── public/
│       ├── src/
│       │   ├── App.js          # ルーティング定義（公開/保護/Admin/Super Admin）
│       │   ├── config/         # api.js(APIクライアント)、constants.js
│       │   ├── auth/           # OAuthコールバック等
│       │   ├── components/     # 共通コンポーネント、ProtectedRoute
│       │   └── routes/         # ページ単位（home, product, auth, profile, order等）
│       ├── package.json
│       ├── Dockerfile
│       └── API_ENDPOINTS.md    # APIエンドポイント一覧
│
└── 文書フォルダ/               # 設計・運用ドキュメント
    ├── API_ENDPOINTS.md
    ├── README-Docker.md
    ├── README-DATABASE.md
    ├── SECURITY_SYSTEM_DOCUMENTATION.md
    ├── SUBSCRIPTION_SYSTEM_DESIGN.md
    └── その他実装ガイドドキュメント


■ 主な機能
--------------------------------------------------------------------------------
1) 会員・認証
   - メール/パスワードログイン、会員登録
   - Google OAuthログイン（Passport）
   - パスワード忘れ（メール認証コード）・再設定
   - JWT/セッション認証、ProtectedRouteによるルート保護

2) 商品・ショッピング
   - 商品一覧（ページネーション、カテゴリ/タグ/検索/ソート）
   - 商品詳細（統計、タグ、シナジー、レビュー）
   - カテゴリ・サブカテゴリ・タグ
   - お気に入り、カート
   - バナー、ランキング、おすすめ・メイン表示

3) 注文・決済
   - カートベースの注文作成
   - クーポン適用、決済手段（カード）管理
   - 注文詳細・履歴、決済完了後のアクティベーションコード発行
   - 決済完了メール・アクティベーションコード送付

4) 購読（定期決済）
   - 月額購読作成（注文連携）
   - 毎月末自動決済、決済失敗時の猶予期間
   - メールリマインダー（多言語: 韓国語/英語/日本語）
   - 購読管理（カード・クーポン変更、解約）

5) プロフィール・チーム
   - プロフィール・設定
   - チームビルダー（AI商品の組み合わせ、シナジースコア）
   - クリエイター一覧・詳細
   - 注文/購読/アクティベーションコード照会

6) 学生認証
   - 学生証アップロード申請
   - Super Adminによる承認/却下、有効期限管理

7) 出品者
   - 出品者申請・申請状態照会
   - Super Adminによる出品者申請の承認/却下

8) 管理者
   - Admin（出品者）: 商品登録/編集、注文・レビュー管理、統計
   - Super Admin: サイト全体管理
     - ダッシュボード、商品承認、学生認証・出品者申請管理
     - IP管理（ブロック/ホワイトリスト）、セキュリティイベント・ボット検知
     - テンプレート（商品セット）管理、セキュリティ設定

9) セキュリティ
   - IPログ、IPブロック/ホワイトリスト
   - Rate Limiting、ボット・スクレイピング検知
   - ログイン試行追跡、自動ブロック（設定時）
   - セキュリティイベントログ・ダッシュボード（Super Admin）

10) その他
    - リソース・テンプレートページ
    - 多言語（i18next）対応
    - レスポンシブUI（Ant Design + Tailwind）


■ 技術スタック概要
--------------------------------------------------------------------------------
[フロントエンド]
- React 17, React Router 5
- Ant Design 5, Tailwind CSS, Lucide React
- Axios（api.js: インターセプターでJWT付与・401時ログインリダイレクト）
- Chart.js, react-chartjs-2, Recharts
- i18next, react-i18next
- dayjs

[バックエンド]
- Node.js, Express 5
- Sequelize 6, mysql2
- Passport（セッション、Google OAuth20）、express-session
- bcrypt, jsonwebtoken
- Multer, CORS
- Nodemailer（メール）
- node-cron（スケジュールジョブ）

[インフラ・デプロイ]
- Docker, Docker Compose
- MySQL 8.0
- Nginx（フロントビルド配信、Docker内）


■ 実行方法（Docker推奨）
--------------------------------------------------------------------------------
1. 前提: Docker、Docker Compose をインストール

2. プロジェクトルートで:
   docker-compose up -d --build

3. アクセス
   - フロントエンド: http://localhost:3000
   - バックエンドAPI: http://localhost:8081
   - MySQL: localhost:3307（ユーザー: aide_user、DB: aide_market）

4. ログ確認
   docker-compose logs -f
   docker-compose logs -f backend
   docker-compose logs -f frontend

5. 停止
   docker-compose down
   （ボリュームまで削除: docker-compose down -v）

※ バックエンド単体: ECSite-server/GIT/ECSite-server で
   npm install → .env設定（DB等） → npm start（デフォルトポート 8081）
※ フロント単体: Electronic-Commerce-Site/grab-market-web で
   npm install → npm start（デフォルトポート 3000）
   API URLは .env または src/config/constants.js の API_URL を確認。


■ API概要
--------------------------------------------------------------------------------
- Base URL: http://localhost:8081（本番時は該当ホストに変更）
- 認証: セッションクッキー または JWT（Authorization: Bearer <token>）
- 主なプレフィックス: /api/*（REST）、/auth（ログイン・OAuth）

主なドメイン:
  /api/products, /api/categories, /api/subcategories, /api/tags
  /api/users, /api/orders, /api/order-items, /api/carts, /api/coupons
  /api/reviews, /api/favorites, /api/rankings, /api/stats
  /api/subscriptions, /api/product-activations
  /api/team-compositions, /api/team-members
  /api/admin/*（Admin/Super Admin専用）
  /api/seller, /api/templates
  /banners, /image（アップロード）

エンドポイント・パラメータ・レスポンス形式の詳細は以下を参照:
  - Electronic-Commerce-Site/grab-market-web/API_ENDPOINTS.md
  - 文書フォルダ/API_ENDPOINTS.md


■ 参照ドキュメント
--------------------------------------------------------------------------------
- Docker: 文書フォルダ/README-Docker.md
- DB接続・シード: 文書フォルダ/README-DATABASE.md
- セキュリティ: 文書フォルダ/SECURITY_SYSTEM_DOCUMENTATION.md
- 購読システム: 文書フォルダ/SUBSCRIPTION_SYSTEM_DESIGN.md
- メール・決済完了・アクティベーションコード: 文書フォルダ/結払完了_メール_活性化コード_システム_実装_ガイド.md
- サイト全体管理者: 文書フォルダ/サイト全体管理者権限システム実装ガイド.md
- 出品者: 文書フォルダ/販売者会員登録実装計画書.md


■ まとめ
--------------------------------------------------------------------------------
AIDE Marketは、AI商品マーケットプレイス向けのフルスタックサービスとして、
会員・商品・注文・購読・管理者・セキュリティ・学生/出品者認証までを
一つのプロジェクトで実装しています。Dockerで素早く起動しデモ・検証に利用でき、
詳細なAPIと設計は上記ドキュメントを参照してください。

================================================================================
ドキュメント作成: プロジェクトソースおよび文書フォルダに基づき整理
================================================================================
