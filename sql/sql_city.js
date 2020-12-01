//創建城市資料表
function creat_table(city) {

    let sql = "CREATE TABLE " + city + " (id INT AUTO_INCREMENT PRIMARY KEY," +
        "cityname VARCHAR(50)," +
        " temp VARCHAR(8)," +
        " rain VARCHAR(8)," +
        " time VARCHAR(80)," +
        " WeatherDescription VARCHAR(200))"
    con.query(sql, function (err, result) {
        if (err) console.log('創建資料表失敗')
    });
}



//刪除城市資料表
function delete_table(city) {
    const sql = 'DROP TABLE' + '`' + city + '`'

    con.query(sql, function (err, result) {
        if (err) throw err;
    });
}



//檢查城市資料表是否存在
function check_table(city) {

    let sql = 'show tables like ' + '"' + city + '"'
    return new Promise(resolve => {
        //判斷資料庫是否存載沒有則發送請求創建
        con.query(sql, (error, results) => {
            if (results[0] == null) {
                creat_table(city)
                console.log("創建資料表" + city)
                resolve()
            } else {
                delete_table(city)
                creat_table(city)
                console.log(city + "刪除舊資料，重新創建")
                resolve()
            }
        })
    })
}

//寫入資料至城市資料表
function add_city_table_data(table, data) {

    let sql = 'INSERT INTO ' + table + ' SET ?'
    con.query(sql, data, function (error) {
        if (error) console.log('寫入數據至縣市資料表失敗')
    })
}