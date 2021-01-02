// MySQL 連接
const pool = require("../mysql");

//時間
const time_func = require('./time_func');


//城市中英json
const citys = require("../json/citys_name.json");

module.exports = {
    //創建城市資料表
    creat_table: function (city) {
        const city_eng = citys[city];

        return new Promise((resolve) => {
            if (city_eng == undefined) resolve(false);

            pool.getConnection((err, connection) => {
                if (err) throw err;

                const sql =
                    "CREATE TABLE " +
                    city_eng +
                    " (id INT AUTO_INCREMENT PRIMARY KEY," +
                    "cityname VARCHAR(30)," +
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
    weather_data_load: function (weather_data, city_name_che) {
        const city_eng = citys[city_name_che];

        let data = "";
        weather_data.forEach((e, i) => {

            for (let n = 0; n < e.weatherElement[0].time.length; n++) {

                //只寫七比
                if (n == 7) return
                const locationName = e.locationName;

                //獲取時間，並處理

                const time = time_func.time_filter(e.weatherElement[0].time[n].startTime);
                const time_1 = time[0];
                const time_2 = time[1];

                //星期幾/明後天
                const day_1 = time[2];
                const day_2 = time[3];

                //獲取氣溫
                const T =
                    e.weatherElement[4].time[n].elementValue.value +
                    "~" +
                    e.weatherElement[3].time[n].elementValue.value;

                //獲取降雨機率
                const PoP12h = e.weatherElement[9].time[n].elementValue.value;

                //獲取降雨機率
                const WD = e.weatherElement[12].time[n].elementValue[0].value;

                const WD_code = e.weatherElement[12].time[n].elementValue[1].value;

                //整理數據
                data += "(";
                data += "'" + locationName + "'";
                data += ",";
                data += "'" + T + "'";
                data += ",";
                data += "'" + PoP12h + "'";
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
                const sql = ` INSERT INTO  ${city_eng} (cityname,temp,rain,day_1,day_2,time_1,time_2,WD,WD_code) VALUES ${data} `;

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
