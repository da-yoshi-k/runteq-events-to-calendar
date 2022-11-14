# RUNTEQイベント登録アプリ

## 概要

RUNTEQのイベント、または面談予約の情報をGoogleカレンダーに登録しやすくするためのGoogle　Chrome用の拡張機能です。

---

## 導入方法

1. ローカルにリポジトリをクローンします

```
$ cd "インストール先のディレクトリ"
$ git clone https://github.com/da-yoshi-k/runteq-events-to-calendar.git
```

2. Chrome上で「chrome://extensions」にアクセスします。

3. 「デベロッパーモード」をONにします。

4. 「パッケージ化されていない拡張機能を読み込む」を押下し、1.でインストールしたディレクトリを選択します。

---

## 使い方

<img src="https://i.gyazo.com/2541d95eee7e92d60935fabbe7d3c798.gif" width="500px">

1. カレンダーに登録したいRUNTEQのイベントページ(または面談予約詳細ページ)を開きます。

2. 拡張機能のアイコンをクリックします。（Ctrl+Shift+Uでも起動可）

3. 「Googleカレンダーに追加する」ボタンをクリックします。

4. 遷移後のGoogleカレンダーのページで内容を確認し、予定を登録します。


---

## 関連記事

[Google Chrome拡張を作成してGoogleカレンダー連携機能を自ら生み出す話](https://qiita.com/da-yoshi-k/items/11bec355b089c89b5be6)
