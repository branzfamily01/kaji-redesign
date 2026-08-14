# 家事リデザイン v2.1 — Firebase セットアップ

## 目的
現行の GitHub Pages / PWA を維持したまま、家族の複数端末同期と Push 通知を追加する。
将来の iOS / Android ストア版でも同じ Firestore / FCM データを使える構造にする。

## 1. Firebase プロジェクトを作成
Firebase Console で新規プロジェクトを作成し、Web App を1つ登録する。
Web App の `firebaseConfig` を `firebase-config.js` の `firebase` に貼り、`enabled: true` にする。

## 2. Authentication
Authentication → Sign-in method で次を有効化する。
- Email/Password
- Anonymous（子ども端末・テスト用。販売版では権限をさらに細分化予定）

## 3. Firestore
Cloud Firestore を作成する。
Firebase CLI でこのリポジトリから次をデプロイする。

```bash
firebase login
firebase use YOUR_PROJECT_ID
firebase deploy --only firestore:rules,firestore:indexes
```

## 4. Web Push / FCM
Cloud Messaging → Web configuration で Web Push certificates の VAPID キーペアを生成する。
公開鍵を `firebase-config.js` の `vapidKey` に設定する。

## 5. Cloud Functions
Blaze プランへ変更後、Functions をデプロイする。

```bash
cd functions
npm install
cd ..
firebase deploy --only functions
```

現在の Functions は、共同担当を含む「新しく担当になった人」への Push を送る。
定時リマインダー本体はタスク側の通知時刻UIを追加する v2.2 で接続する。

## 6. 家族同期の使い方
1. 設定 → 「家族同期・Push」
2. メールで新規登録 / ログイン
3. 1台目は「わが家を作る」
4. 「招待コード発行」
5. 別端末でログインし「招待コードで参加」
6. その端末を誰として通知するか選択
7. 「Pushを有効化」

## データ構造
- `users/{uid}`
- `users/{uid}/households/{householdId}`
- `households/{householdId}`
- `households/{householdId}/access/{uid}`
- `households/{householdId}/members/{memberId}`
- `households/{householdId}/tasks/{taskId}`
- `households/{householdId}/completions/{yyyy-mm-dd}`
- `households/{householdId}/meta/current`
- `households/{householdId}/devices/{uid_deviceId}`
- `invites/{inviteCode}`

## 注意
- `firebase-config.js` の Web App 設定値自体はクライアント向け識別情報で、管理者秘密鍵ではない。
- Admin SDK のサービスアカウント秘密鍵を GitHub に置かない。
- Firestore Security Rules が実際のアクセス制御を担う。
- iOS / Android ストア版では同じ Firebase プロジェクトに Apple / Android App を追加し、同じ household データを共有する。
