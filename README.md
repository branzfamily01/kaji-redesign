# 家事リデザイン v2.1

**表は今日を回す。裏で家庭を軽くする。**

家庭内タスクを「今日、誰が何をするか」で一瞥できるようにしつつ、やめる / 自動化 / 簡略化 / 分担 / 子どもの自立移管を進める家庭運営アプリです。

## v2.1
- GitHub Pages / PWA はそのまま維持
- `localStorage` はオフライン・バックアップ用途として維持
- Firebaseクラウド同期ブリッジ追加
- Email/Password / Anonymous Auth 対応コード
- 家庭作成・招待コード参加
- Firestoreリアルタイム同期
- 端末と家族メンバーの紐付け
- FCM Web Push登録
- 担当変更Push用 Cloud Function
- Firestore Security Rules

Firebase未設定の状態では、これまで通りローカル版として動作します。

## Firebase設定
[`FIREBASE_SETUP.md`](./FIREBASE_SETUP.md) を参照してください。

## 将来のApp Store / Google Play
同じ Firebase プロジェクトを iOS / Android クライアントから利用する前提の `user / household / member / device` 構造です。
