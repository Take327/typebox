# **TypeBox**

## **1. プロジェクト概要**

### **目的**

- MBTI診断を通じて自己理解を深め、その結果を共有・分析できるプラットフォームを提供。

## **2. 機能要件**

### **1. 診断機能**

1. **診断開始**
   - ログイン後、診断を開始可能。
   - 診断セッションIDをユーザーIDと紐付けてサーバーで管理。
2. **質問リストの表示**
   - 質問をリアルタイムでサーバーに送信し、進行状況を記録。
3. **進行状況の可視化**
   - プログレスバーや数値表示で進行状況を可視化。
4. **診断結果の計算**
   - サーバー側で回答を集計し、MBTIタイプを計算・表示。
5. **一時保存機能**
   - 「一時保存」ボタンまたは自動保存により進行状況を保存。
   - ログイン後に保存データをロードして再開可能。
6. **診断結果の履歴管理**
   - ユーザーごとに過去の診断結果をデータベースに保存。
   - 履歴をフィルタリング・ソートして表示。

---

### **2. タイプ確認機能**

1. **診断結果の詳細表示**
   - MBTIタイプの特性、適性職業、相性情報などを提供。
2. **診断履歴の管理**
   - 過去の診断結果を閲覧・削除可能。
3. **相性確認**
   - 他のタイプとの相性を表示。

---

### **3. グループ機能**

1. **グループ作成**
   - ユーザーがグループを作成可能（名前と説明文を設定）。
   - 招待元ユーザーがメンバーをアプリ内通知で招待。
2. **招待リクエストの送信**
   - 招待の成否に関わらず、統一メッセージを返す:
     - 「招待のリクエストを受け付けました。詳細は後ほど通知します。」
3. **非同期処理と通知**
   - 招待リクエストを非同期で処理。
   - 存在するユーザーのみ以下の通知を送信:
     - 招待元ユーザー: 「招待が送信されました。」
     - 招待先ユーザー: アプリ内通知で「[グループ名]に招待されました。」
4. **招待リクエストの無効化**
   - 存在しないユーザーや不正なリクエストは無視。
   - ログ記録のみ行い、通知は行わない。
5. **ブルートフォース防止**
   - レート制限を適用（例: 1分間に5件まで）。
   - 必要に応じてCAPTCHAを導入。
6. **相性診断**
   - グループ内のメンバー同士のMBTI相性を計算し、一覧で表示。
   - 相性スコアや簡単な解説を提供。
7. **相関図作成**
   - グループ内のメンバー間の相性を相関図として可視化。
   - ノード（ユーザー）とエッジ（相性スコア）を用いたグラフ形式を採用。
   - メンバー追加・削除時にリアルタイムで相関図を更新。

---

# プロジェクト構成と各ファイルの役割

## **`app` ディレクトリ**

このディレクトリは Next.js のルーティングと全体レイアウトを管理します。

### ルートファイル

- **`favicon.ico`**: ブラウザのタブやブックマークで表示されるアイコンファイル。
- **`globals.css`**: アプリ全体で適用されるグローバルスタイルを定義。
- **`layout.tsx`**: 全ページ共通のレイアウトやメタデータを定義。
- **`MyPage.tsx`**: ユーザーの診断結果や所属グループ、通知を表示するメインダッシュボード。
- **`page.tsx`**: アプリのトップページ（デフォルトルート）を定義。

### APIエンドポイント

- **`api/auth/options.ts`**: 認証の設定を定義（`next-auth` の設定）。
- **`api/auth/check/route.ts`**: 認証状態を確認するAPIエンドポイント。
- **`api/auth/logout/route.ts`**: ログアウト処理のエンドポイント。
- **`api/auth/[...nextauth]/route.ts`**: `next-auth` が認証フローを処理するための主要エンドポイント。
- **`api/diagnosisResult/route.ts`**: 診断結果を取得するためのエンドポイント。
- **`api/insertDiagnosisResult/route.ts`**: 診断結果を保存するためのエンドポイント。

### コンポーネント

- **`AuthButton.tsx`**: 認証用ボタン（GoogleやMicrosoftなど）を提供。
- **`Backdrop.tsx`**: データ取得や処理中の際に画面全体を覆うローディングコンポーネント。
- **`Card.tsx`**: 各セクションを囲むカードUIを提供。
- **`Construction.tsx`**: 開発中や未実装機能を示すためのプレースホルダーコンポーネント。
- **`FlowbitProgress.tsx`**: Flowbite の進捗バーコンポーネント。
- **`FlowbitRange.tsx`**: Flowbite の範囲スライダーコンポーネント。
- **`Footer.tsx`**: フッターコンポーネント（利用規約やプライバシーポリシーリンクを含む）。
- **`GroupListItem.tsx`**: グループリストの個々のアイテムを表現。
- **`Header.tsx`**: シンプルなヘッダーを提供。
- **`HeaderWithMenu.tsx`**: メニュー付きのヘッダーコンポーネント。
- **`MBTITendenciesChart.tsx`**: MBTI診断の傾向をチャートで表示。
- **`SideMenu.tsx`**: サイドメニューコンポーネント。
- **`icons/GoogleIcon.tsx`**: Googleログイン用アイコン。
- **`icons/MicrosoftIcon.tsx`**: Microsoftログイン用アイコン。

### 診断機能

- **`diagnosis/progress/page.tsx`**: 診断進行画面を管理。
- **`diagnosis/result/page.tsx`**: 診断結果を表示。
- **`diagnosis/start/calculateMBTITypeBL.ts`**: MBTIタイプを計算するビジネスロジック。
- **`diagnosis/start/DiagnosisPage.tsx`**: 診断開始ページのロジック。
- **`diagnosis/start/page.tsx`**: 診断開始ページのエントリーポイント。
- **`diagnosis/start/questions.ts`**: 診断で使用する質問リスト。

### グループ管理

- **`groups/index/page.tsx`**: グループ一覧画面。
- **`groups/[id]/page.tsx`**: 個別グループの詳細画面。

### その他のページ

- **`login/page.tsx`**: ログインページ。
- **`notifications/page.tsx`**: 通知一覧ページ。
- **`profile/page.tsx`**: プロフィール管理ページ。

---

## **`context` ディレクトリ**

コンテキストAPIを使用したグローバル状態管理。

- **`MenuContext.tsx`**: メニューの開閉状態を管理。
- **`ProcessingContext.tsx`**: 処理中状態（ローディング状態）を管理。

---

## **`lib` ディレクトリ**

サーバーサイド処理やデータベースとのやり取りを提供。

- **`db.ts`**: データベース接続を管理。
- **`getLatestDiagnosisResult.ts`**: 最新の診断結果を取得するユーティリティ関数。
- **`getServerSessionUserId.ts`**: サーバーサイドでユーザーIDを取得する関数。

---

## **`mock` ディレクトリ**

モックデータを管理。

- **`index.ts`**: テストや開発用のダミーデータを提供。

---

## **`types` ディレクトリ**

型定義を管理。

- **`index.ts`**: 共通の型定義を格納。
- **`next-auth.d.ts`**: `next-auth` に関連する型定義を拡張。

---

## **`utils` ディレクトリ**

汎用ユーティリティ関数を格納。

- **`convertToDiagnosis.ts`**: 診断結果データを変換する関数。

---
