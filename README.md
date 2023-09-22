# 台灣天氣開放資料抓取

透過 nodejs 連接 api 後寫入 mysql

## 環境

xampp : https://www.apachefriends.org/zh_tw/download.html

## 運行

```
git clone https://github.com/ni-null/taiwan_opendata_weather.git

cd  taiwan_opendata_weather

npm i
```

## 設置

創建 api_key.txt 並於裡面填入你的 api key

創建 mysql.js 設定檔內填入你的資料庫密碼及名稱

```
/* mysql  */
const mysql = require("mysql")

const pool = mysql.createPool({
  connectionLimit: 40,
  host: "localhost",
  user: "root",
  password: "",
  database: "weather",
  multipleStatements: true,
})

module.exports = pool


```

## 運行

```
npm  start
```

運行時會檢測一次，之後每 20 分鐘運行檢測一次
