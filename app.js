//module

const axios = require("axios");

const mysql = require("mysql");

const fs = require("fs");

const schedule = require("node-schedule");

const {
  COPYFILE_FICLONE
} = require("constants");

//城市中英json
const citys = require("./json/citys_name.json");

//資料庫
const con_mysql_info = require("./json/con_mysql_info.json");

const con = mysql.createConnection(con_mysql_info);

con.connect();

con.connect(function (err) {
  if (err) {
    console.log("mysql 連接失敗");

  }
  console.log("mysql 連接成功");
});


//時間過濾
eval(fs.readFileSync("./function/time_filter.js") + "");

//檢查city存在，創建，新增，刪除
eval(fs.readFileSync("./sql/sql_city.js") + "");

//檢查taiwan存在，創建，新增，刪除
eval(fs.readFileSync("./sql/taiwan_city.js") + "");

//檢查conf存在，創建，寫入更新時間
eval(fs.readFileSync("./sql/sql_conf.js") + "");

//台灣天氣抓取
eval(fs.readFileSync("./taiwan_weather.js") + "");

//縣市天氣抓取
eval(fs.readFileSync("./city_weather.js") + "");




//讀取api_key
fs.open("./api_key.txt", function (err, fd) {
  if (err != null) {
    console.log("沒有偵測到api_key檔案");

    fs.appendFile("./api_key.txt", "", function (err) {
      if (err) console.log("已經創建『api_key.txt』請於裡面添加apikey");
    });
  } else {
    fs.readFile("./api_key.txt", function (err, data) {
      const key = data.toString();

      if (key.length != 0) {
        //每20分鐘運行一次
        schedule.scheduleJob('*/20 * * * * ', function () {
          const time = new Date()
          console.log(time)
          get_city_weather(key)
          get_taiwan_weather(key)
        });

        get_city_weather(key)
        get_taiwan_weather(key)
      } else console.log("『api_key.txt』為空");
    });
  }
});