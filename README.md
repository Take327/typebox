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

以下のドキュメントは、**TypeBox** のデザインガイドラインを総合的にまとめたものです。これまでの議論や実装方針を踏まえ、Tailwind CSS + Flowbite-React をベースに**マテリアルデザインのエッセンス**を取り入れています。開発チーム内で共有し、UI/UXを統一的に保ちつつ保守性を高めてください。

---

# TypeBox デザインガイドライン

## 1. 概要

- **フレームワーク / 言語**:
  - Next.js (app routing, v15)
  - TypeScript
  - Tailwind CSS / Flowbite-React
- **コンセプト**:
  - MBTI診断を中心としたユーザー体験の提供
  - 「シンプルで温かみのある」ビジュアルイメージ
  - ユーザーが直感的に操作できるUI/UX

マテリアルデザインで推奨される**階層感**や**余白の取り方**、**アクセシビリティ**を重視しています。

---

## 2. カラースキーム

TypeBox全体で採用しているカラーは、大きく以下の4種類＋α です。Tailwind上では `tailwind.config.ts` 内の `extend.colors` で管理し、Flowbite-Reactのカスタムテーマにも反映させます。

| 項目                 | 色（Hex） | 用途／メモ                                                   |
| :------------------- | :-------: | :----------------------------------------------------------- |
| **Primary (Header)** | `#F7E4C9` | ヘッダーやロゴ付近などで使用。淡いベージュ。                 |
| **Primary (Footer)** | `#F6CEB4` | フッター用にやや濃いベージュ。                               |
| **Accent**           | `#81D8D0` | ボタン・スイッチ・強調表示などインタラクティブ要素。         |
| **Background**       | `#F3F4F6` | 全体の背景として採用する淡いグレー。                         |
| **Text**             |  `#333`   | 主要テキスト色として利用（場合により `#444`, `#555` も可）。 |

### 2.1 カラーバリエーション

- **Primaryカラー**:
  - `primary.50` → `#F7E4C9` (薄め)
  - `primary.200` → `#F6CEB4` (やや濃いめ)
- **Accentカラー**:
  - `accent.DEFAULT` → `#81D8D0`
  - `accent.light` / `accent.dark` などを拡張し、ホバーやアクティブ時に色変化をつける。

#### 2.2 背景色とテキストコントラスト

- 背景に `#F3F4F6` を使う場合、テキストは `#333` や `#444` など濃いめのグレーで **4.5:1** 以上のコントラストを確保。

---

## 3. タイポグラフィ

- **推奨フォント**:
  - `Noto Sans JP` や `Roboto`, もしくは `Inter` など
  - Fallback として `system-ui`, `Arial`, `sans-serif` を指定
- **階層例 (Tailwind)**:  
  | スタイル | クラス例 | px換算 | 用途 |
  |:-------:|:-------------------------:|:------:|:-------------------|
  | H1 | `text-4xl font-bold` | ~32px | メイン見出し |
  | H2 | `text-3xl font-medium` | ~28px | サブ見出し |
  | H3 | `text-2xl font-medium` | ~24px | セクション見出し |
  | Body1 | `text-base` | 16px | 本文 |
  | Body2 | `text-sm` | 14px | サブ情報・注釈 |
  | Caption | `text-xs` | 12px | ラベル・キャプション |

---

## 4. レイアウトとスペーシング

- **Tailwind のグリッド・フレックス**ユーティリティを活用
- **8px刻み**のマージン・パディング (e.g. `p-4`, `m-2` など)
- マテリアルデザインに倣い、**12カラムレイアウト**や**適切な余白**を採用することで、情報の整理と見やすさを向上。

---

## 5. 主要コンポーネントのスタイル指針

### 5.1 ヘッダー

- **背景色**: `bg-primary-50` (`#F7E4C9`)
- **テキスト色**: 濃いめのグレー (`text-gray-800` など)
- **高さ**: 64px前後 (レスポンシブ対応)
- **配置**: 左にロゴ、右にメニュー or ユーザーアイコン

### 5.2 フッター

- **背景色**: `bg-primary-200` (`#F6CEB4`)
- **テキスト色**: 白文字 (`text-white`) やグレーなどコントラストを確保
- **高さ**: 48～64px
- **最下部配置**: コピーライトやフッターメニュー

### 5.3 ボタン (Flowbite-React)

- **アクセントカラー**: `bg-accent` (`#81D8D0`)
- **テキスト色**: 白文字 (`text-white`)
- **角丸**: `rounded-md` や `rounded-lg`
- **ホバー効果**: `hover:bg-accent-dark` + 軽度のシャドウ推奨

### 5.4 トグルスイッチ (Flowbite-React)

- カスタムテーマの `toggleSwitch` 設定で `color="accent"` 時に `bg-accent` が反映されるようにする。
- ON時: `bg-accent`、OFF時: `bg-gray-200`
- **ラベル**を必ず付与し、可読性とアクセシビリティを確保。

### 5.5 テキスト入力 (Flowbite-ReactのTextInput)

- **ボーダー**: `border-gray-300`
- **フォーカス時**: `focus:ring-accent` / `focus:border-accent`
- エラー時や成功時など、色分けが必要なら各種 `border-red-500` / `border-green-500` のように設定する。

### 5.6 カード・モーダル

- **背景**: `bg-white` (もしくは `bg-background` で若干のグレードをつける)
- **枠線またはシャドウ**: `border border-gray-200` + `shadow-md`
- **角丸**: `rounded-lg` (8px程度)
- **マージン・パディング**: 16px前後を確保

### 5.7 プログレスバー / チャート

- ベースのバー: `bg-gray-200`
- 進捗部分 (bar): `bg-accent` / その他区分を使用するなら、パステル調の色をカスタム
- テキストラベル: `text-sm text-gray-700`

---

## 6. Flowbite-React カスタムテーマ

Tailwind と併用するため、`Flowbite` コンポーネントを**カスタムテーマ**でラップします。 例:

```tsx
import { Flowbite } from "flowbite-react";
import customTheme from "path/to/customTheme";

function MyApp({ Component, pageProps }) {
  return (
    <Flowbite theme={{ theme: customTheme }}>
      <Component {...pageProps} />
    </Flowbite>
  );
}

export default MyApp;
```

### 6.1 カスタムテーマの例

- `toggleSwitch` や `progress` など、TypeBox独自の色名 `accent` を使用
- ON 時やアクティブ時に `bg-accent` が適用されるよう定義

```ts
/**
 * @file customTheme.ts
 * @description TypeBoxのカラーパレットをFlowbite-React向けにマッピング
 */
import type { CustomFlowbiteTheme } from "flowbite-react";

const customTheme: CustomFlowbiteTheme = {
  toggleSwitch: {
    toggle: {
      base: "relative rounded-full border after:absolute after:rounded-full after:bg-white after:transition-all",
      checked: {
        on: "after:translate-x-full after:border-white",
        off: "border-gray-200 bg-gray-200",
        color: {
          accent: "border-accent bg-accent", // ON時の色
        },
      },
    },
  },
  // その他Spinner, Alert, ProgressBarなども同様に定義
};

export default customTheme;
```

---

## 7. globals.css (Tailwind/CSS)

- **Tailwindのプリフライト**（`@tailwind base; @tailwind components; @tailwind utilities;`）を利用
- 全体の背景・テキスト色は原則Tailwindクラスを使うが、必要に応じて `:root` 変数で指定

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --background: #f3f4f6;
  --foreground: #333;
}

body {
  color: var(--foreground);
  background: var(--background);
  font-family: "Noto Sans JP", "Roboto", ui-sans-serif, Arial, sans-serif;
}

/* Rangeスライダーなど一部ブラウザに依存する要素にアクセントカラーを適用 */
input[type="range"]::-webkit-slider-thumb {
  background-color: #81d8d0; /* Accent */
  /* ... */
}
```

---

## 8. アクセシビリティ (A11y)

- **コントラスト**: 背景色と文字色の比率を常に4.5:1以上を目標とする (WCAG 2.1 AA)。
- **フォーカス可視化**: `focus:ring-2 focus:ring-accent` などのTailwindクラスを利用し、キーボード操作時に明確なフォーカスリングを表示。
- **ラベル対応**: ボタン・トグルスイッチなどはテキストラベルか `aria-label` を設定して、スクリーンリーダー対応を行う。

---

## 9. 今後の運用と拡張

1. **コンポーネント管理**:
   - 共通部品（ボタン、カード、フォームコントロールなど）は `/components/ui/` にまとめ、Storybookで可視化／テストすることを推奨。
2. **カラーバリエーション追加**:
   - 必要に応じて `primary.300` や `accent.dark` などをTailwind設定やFlowbiteテーマに追記し、ホバー・アクティブ時のバリエーションを増やす。
3. **パステルカラーのチャート**:
   - グラフ・プログレスバーで複数種類の色を使う場合、**同系統のパステルトーン**を抽出して、見やすさとブランドイメージを両立する。
4. **アクセシビリティ強化**:
   - フォントサイズの拡大（ユーザー設定）に対応できる相対指定 (rem / em) などを検討。
   - スクリーンリーダーによる読み上げテストを行い、追加の `aria-` 属性が必要な箇所を整備。

---
