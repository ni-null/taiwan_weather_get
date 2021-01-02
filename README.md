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

myslq 設定檔

```
mysql.js

```

## 運行

```
npm  start
```
運行時會檢測一次，之後每20分鐘運行檢測一次


