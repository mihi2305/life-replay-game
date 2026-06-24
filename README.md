# 人生リプレイ：あの日の選択

ブラウザで遊べる、人生育成シミュレーション型の性格診断ゲームです。

小学校から社会に出る前までの45ターンを、毎月の行動選択で進めます。学力、スキル、社交性、体力、満足度、お金を管理しながら、習い事、受験、進学ルート、大学ルート、カード獲得、最終タイプ判定まで遊べます。

## 構成

このプロジェクトは React / Vite などを使わない、vanilla HTML / CSS / JavaScript の静的サイトです。

- `index.html`: 画面構造
- `styles.css`: UIと演出
- `game.js`: ゲーム進行、状態管理、イベント、ルート分岐、最終判定
- `package.json`: ローカル起動とチェック用スクリプト
- `vercel.json`: Vercel公開用の最小設定

## ローカルで起動する

```bash
npm run dev
```

起動後、ブラウザで以下を開きます。

```text
http://127.0.0.1:5173
```

構文チェックだけ行う場合:

```bash
npm run check
```

## Vercelでデプロイする

1. このリポジトリをGitHubにpushします。
2. Vercelで「Add New Project」を選びます。
3. GitHubリポジトリをImportします。
4. Framework Presetは `Other` のままで問題ありません。
5. Build Commandは `npm run build` を使います。
6. Output Directoryは `.` です。
7. Deployを実行します。

このプロジェクトは静的サイトなので、Vercel上では `index.html`、`styles.css`、`game.js` がそのまま配信されます。

## GitHubにpushする手順

初回の例:

```bash
git add .
git commit -m "Prepare static game for Vercel deployment"
git branch -M main
git remote add origin https://github.com/<your-user>/<your-repo>.git
git push -u origin main
```

すでにremoteがある場合:

```bash
git add .
git commit -m "Prepare static game for Vercel deployment"
git push
```

## 未実装の機能

今回は、ゲーム本体をGitHub管理・Vercel公開しやすい形に整理することを優先しています。

以下はまだ実装していません。

- セーブ機能
- リロード復元
- Supabase Auth連携
- Supabase Database連携
- ユーザーごとのプレイ履歴保存

## 今後の予定

1. GitHubにコードを置く
2. Vercelで公開する
3. `localStorage` で一時保存・リロード復元を実装する
4. クリア済みデータを人生ライブラリとして保存する
5. Supabase Auth / Database と連携する
6. ユーザーごとのセーブデータ・プレイ履歴を保存する

## 注意

現在のゲームはクライアント内だけで完結します。プレイ結果や進行状況はサーバーには保存されません。
