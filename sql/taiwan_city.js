//檢查城市資料表是否存在
function check_taiwan_table() {

    let sql = 'show tables like ' + '"taiwan"'
    return new Promise(resolve => {
        //判斷資料庫是否存載沒有則發送請求創建
        con.query(sql, (error, results) => {
            if (results[0] == null) {
                creat_taiwan()
                resolve()
            } else {
                delete_taiwan_table()
                creat_taiwan()
                console.log("刪除舊資料，重新創建")
                resolve()
            }
        })
    })
}


function creat_taiwan() {

    let sql = "CREATE TABLE taiwan (id INT AUTO_INCREMENT PRIMARY KEY," +
        "cityname VARCHAR(50)," +
        " temp VARCHAR(8)," +
        " rain VARCHAR(8)," +
        " time_1 VARCHAR(16)," +
        " time_2 VARCHAR(16)," +
        " WeatherDescription VARCHAR(200))"
    con.query(sql, function (err, result) {
        if (err) console.log('創建資料表失敗')
    });
}

//刪除城市資料表
function delete_taiwan_table() {
    const sql = 'DROP TABLE' + '`' + "taiwan" + '`'

    con.query(sql, function (err, result) {
        if (err) throw err;
    });
}

//寫入資料至城市資料表
function add_taiwan_table_data(data) {

    let sql = 'INSERT INTO ' + "taiwan" + ' SET ?'
    con.query(sql, data, function (error) {
        if (error) console.log('寫入數據至縣市資料表失敗')
    })
}