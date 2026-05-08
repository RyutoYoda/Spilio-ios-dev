# Spilio - App Store 公開手順書

ローカルPCからApp Storeにアプリを公開するための手順です。

---

## 前提条件

| 必要なもの | 備考 |
|-----------|------|
| Apple Developer Program | 年間$99。https://developer.apple.com/programs/ |
| Node.js | https://nodejs.org/ からLTS版をインストール |
| EAS CLI | `npm install -g eas-cli` でインストール |
| Expoアカウント | https://expo.dev/ で作成済み（ryutoyoda） |

---

## 初回セットアップ（1回だけやればOK）

### 1. EAS CLIをインストール

```bash
npm install -g eas-cli
```

### 2. Expoにログイン

```bash
eas login
```

- メール: `s27928@cyberagent.email`
- パスワード: Expoアカウントのパスワード

### 3. リポジトリをクローン

```bash
git clone https://github.com/RyutoYoda/Spilio-ios-dev.git
cd Spilio-ios-dev
```

### 4. 依存パッケージをインストール

```bash
npm install
```

### 5. iOS証明書を設定（初回のみ）

```bash
eas credentials --platform ios
```

- 「production」を選択
- 「Build Credentials」→「All: Set up all...」を選択
- Apple IDでログイン（`r.libra6788@gmail.com`）
- 「Let Expo handle it」系の選択肢を選ぶ → 自動生成される

> 証明書は1年間有効。期限切れたら再度このコマンドを実行。

---

## アプリを公開する手順（毎回やること）

### ステップ1: 最新コードを取得

```bash
cd Spilio-ios-dev
git pull origin main
```

### ステップ2: 依存パッケージを更新

```bash
npm install
```

### ステップ3: iOSビルドを実行

```bash
eas build --platform ios --profile production
```

- ビルドには10〜20分かかる
- 進捗はターミナルに表示されるURLで確認可能
- `Ctrl+C`で待機を抜けてもビルドは裏で続く

### ステップ4: App Store Connectに提出

ビルド完了後：

```bash
eas submit --platform ios
```

- 「Select a build」で最新のビルドを選択
- Apple IDのログインを求められたら入力

### ステップ5: App Store Connectで審査に提出

1. https://appstoreconnect.apple.com を開く
2. 「マイApp」→「Spilio」を選択
3. 以下を設定：
   - アプリの説明文（日本語・英語）
   - スクリーンショット（6.7インチ・6.5インチ）
   - カテゴリ: Education
   - 年齢制限: 4+
   - プライバシーポリシーURL
4. 「審査に提出」ボタンを押す

> 審査は通常1〜3日で完了。

---

## よく使うコマンドまとめ

| やりたいこと | コマンド |
|-------------|---------|
| Expoにログイン | `eas login` |
| ログイン状態確認 | `eas whoami` |
| iOSビルド | `eas build --platform ios --profile production` |
| App Storeに提出 | `eas submit --platform ios` |
| 証明書の確認・再設定 | `eas credentials --platform ios` |
| ビルド一覧を確認 | `eas build:list` |

---

## トラブルシューティング

### 「eas: command not found」

```bash
npm install -g eas-cli
```

### 「node modules not installed」

```bash
npm install
```

### 「Distribution Certificate not found」

```bash
eas credentials --platform ios
```
→ productionを選んで証明書を再生成

### 「Invalid UUID appId」

`app.config.ts`の`extra.eas.projectId`が正しいか確認：
```
projectId: "6d49f67f-36d0-4aab-bb1b-e670fbff047a"
```

### 「Experience does not exist」

`app.config.ts`の`owner`と`slug`が正しいか確認：
```
owner: "ryutoyoda"
slug: "spilio"
```

---

## プロジェクト情報

| 項目 | 値 |
|------|-----|
| Expo Owner | ryutoyoda |
| Expo Slug | spilio |
| EAS Project ID | 6d49f67f-36d0-4aab-bb1b-e670fbff047a |
| Bundle ID | space.manus.english.master.t20260503222854 |
| Apple Team ID | 246DJYP2AH |
| Apple Team Name | RYUTO YODA (Individual) |
| GitHub Repo | https://github.com/RyutoYoda/Spilio-ios-dev |
