// MySQL 連接
const pool = require("../mysql")

//城市中英json
const citys = require("../json/citys_name.json")

module.exports = {
  //創建成功 true ，失敗false(包含已經存在)
  creat_conf_table: function () {
    return new Promise((resolve) => {
      pool.getConnection((err, connection) => {
        if (err) throw err

        const sql = "CREATE TABLE `conf`" + "(id INT AUTO_INCREMENT PRIMARY KEY,city_name VARCHAR(16),table_name VARCHAR(40),update_time VARCHAR(40))"

        connection.query(sql, (err, rows) => {
          connection.release() // return the connection to pool

          if (!err) {
            resolve(true)
          } else {
            resolve(false)
          }
        })
      })
    })
  },

  //寫入資料，成功true
  original_data_seting_conf: function () {
    let data = ""

    let city_all_che = Object.keys(citys)

    city_all_che.forEach((e, i) => {
      data += "("
      data += "'" + city_all_che[i] + "'"
      data += ","
      data += "'" + citys[city_all_che[i]] + "'"
      data += ","
      data += "'" + 0 + "'"
      data += ")"
      if (i != city_all_che.length - 1) data += ","
    })

    return new Promise((resolve) => {
      pool.getConnection((err, connection) => {
        const sql = "INSERT INTO `conf` (`city_name`, `table_name`, `update_time`) VALUES " + data

        connection.query(sql, (err, rows) => {
          connection.release() // return the connection to pool

          if (!err) {
            resolve(true)
          } else {
            console.log(err)
            resolve(false)
          }
        })
      })
    })
  },

  //取得更新時間

  get_city_update_time_from_conf: function (city_name_che) {
    return new Promise((resolve) => {
      pool.getConnection((err, connection) => {
        const sql = ` SELECT  update_time   FROM   conf where city_name = '${city_name_che}' `

        connection.query(sql, (err, rows) => {
          connection.release() // return the connection to pool

          if (!err) {
            resolve(rows[0])
          } else {
            console.log(err)
            resolve(false)
          }
        })
      })
    })
  },

  //更新時間
  update_data_time: function (update_time, city_name_che) {
    return new Promise((resolve) => {
      pool.getConnection((err, connection) => {
        const sql = `UPDATE conf SET update_time = '${update_time}' WHERE city_name = '${city_name_che}'`

        connection.query(sql, (err, rows) => {
          connection.release() // return the connection to pool

          if (!err) {
            resolve(true)
          } else {
            console.log(err)
            resolve(false)
          }
        })
      })
    })
  },
  //創建天氣資料表

  creat_weather_table: function () {
    const table_names = Object.values(citys)

    let sql = ""

    table_names.forEach((e, i) => {
      sql += `CREATE TABLE IF NOT EXISTS ${e} ` + " (id INT AUTO_INCREMENT PRIMARY KEY," + "cityname VARCHAR(30),"

      if (i == 0) sql += "cityname_eng VARCHAR(30),"

      sql +=
        " temp VARCHAR(8)," +
        " rain VARCHAR(8)," +
        " time_1 VARCHAR(16)," +
        " time_2 VARCHAR(16)," +
        " day_1 VARCHAR(16)," +
        " day_2 VARCHAR(16)," +
        " WD VARCHAR(16)," +
        " WD_code VARCHAR(16));"
    })

    return new Promise((resolve) => {
      pool.getConnection((err, connection) => {
        if (err) throw err

        connection.query(sql, (err, rows) => {
          connection.release() // return the connection to pool

          if (!err) {
            resolve(true)
          } else {
            resolve(false)
          }
        })
      })
    })
  },
}

//寫入原始資料
