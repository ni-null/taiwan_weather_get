// MySQL 連接
const pool = require("../mysql");

const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc"); // dependent on utc plugin
const timezone = require("dayjs/plugin/timezone");
const isToday = require("dayjs/plugin/isToday");
dayjs.extend(isToday);
const isTomorrow = require("dayjs/plugin/isTomorrow");
dayjs.extend(isTomorrow);

//城市中英json
const citys = require("../json/citys_name.json");

//時間
const time_func = require('./time_func');


module.exports = {

    //創建城市資料表
    creat_table: function (city) {

        return new Promise((resolve) => {

            pool.getConnection((err, connection) => {
                if (err) throw err;

                const sql =
                    "CREATE TABLE  taiwan " +
                    " (id INT AUTO_INCREMENT PRIMARY KEY," +
                    "cityname VARCHAR(30)," +
                    "cityname_eng VARCHAR(30)," +
                    " temp VARCHAR(8)," +
                    " rain VARCHAR(8)," +
                    " time_1 VARCHAR(16)," +
                    " time_2 VARCHAR(16)," +
                    " day_1 VARCHAR(16)," +
                    " day_2 VARCHAR(16)," +
                    " WD VARCHAR(16)," +
                    " WD_code VARCHAR(16))";

                connection.query(sql, (err, rows) => {
                    connection.release(); // return the connection to pool

                    if (!err) {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                });
            });
        });
    },

    //刪除城市資料表
    clear_table: function (city) {
        const city_eng = citys[city];

        return new Promise((resolve) => {
            if (city_eng == undefined) resolve(false);

            pool.getConnection((err, connection) => {
                if (err) throw err;

                const sql = "TRUNCATE  TABLE " + city_eng;

                connection.query(sql, (err, rows) => {
                    connection.release(); // return the connection to pool

                    if (!err) {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                });
            });
        });
    },

    //更寫入資料
    weather_data_load: function (weather_data, name_eng) {

        let data = "";
        weather_data.forEach((e) => {
            const cityname = e.locationName;
            const cityname_eng = citys[cityname];
            const MinT = e.weatherElement.find((x) => x.elementName === "MinT");
            const MaxT = e.weatherElement.find((x) => x.elementName === "MaxT");
            const PoP12h = e.weatherElement.find((x) => x.elementName === "PoP12h");
            const Wx = e.weatherElement.find((x) => x.elementName === "Wx");

            for (let i = 0; i < 7; i++) {
                const temp =
                    MinT.time[i].elementValue.value + "~" + MaxT.time[i].elementValue.value;

                const rain = PoP12h.time[i].elementValue.value;

                const startTime = PoP12h.time[i].startTime;

                const time = time_func.time_filter(startTime);

                const time_1 = time[0];
                const time_2 = time[1];

                const day_1 = time[2];
                const day_2 = time[3];

                const WD = Wx.time[i].elementValue[0].value;

                const WD_code = Wx.time[i].elementValue[1].value;

                //整理數據
                data += "(";
                data += "'" + e.locationName + "'";
                data += ",";
                data += "'" + cityname_eng + "'";
                data += ",";
                data += "'" + temp + "'";
                data += ",";
                data += "'" + rain + "'";
                data += ",";
                data += "'" + day_1 + "'";
                data += ",";
                data += "'" + day_2 + "'";
                data += ",";
                data += "'" + time_1 + "'";
                data += ",";
                data += "'" + time_2 + "'";
                data += ",";
                data += "'" + WD + "'";
                data += ",";
                data += "'" + WD_code + "'";
                data += ")";
                data += ",";

            }
        });



        //刪除多餘字元
        data = data.substring(0, data.length - 1);

        return new Promise((resolve) => {

            pool.getConnection((err, connection) => {
                const sql = ` INSERT INTO  ${name_eng} (cityname,cityname_eng,temp,rain,day_1,day_2,time_1,time_2,WD,WD_code) VALUES ${data} `;

                connection.query(sql, (err, rows) => {
                    connection.release(); // return the connection to pool

                    if (!err) {
                        resolve(true);
                    } else {
                        console.log(err);
                        resolve(false);
                    }
                });
            });
        });
    },
};