//檢查設定檔是否存在，沒有創建

(function () {
  const sql = 'show tables like "conf"';
  con.query(sql, (error, results) => {
    if (results[0] == null) {
      creat_conf();
      console.log("創建conf設定");
    }
  });
})();

//創建設定檔 conf

function creat_conf_table() {
  const sql =
    "CREATE TABLE `conf` (id INT AUTO_INCREMENT PRIMARY KEY,city_name VARCHAR(16),table_name VARCHAR(40),update_time VARCHAR(20))";
  return new Promise((resolve) => {
    con.query(sql, function (err) {
      if (!err) resolve();
    });
  });
}

//寫入conf預設資料
async function creat_conf() {
  let ob_ct = Object.keys(citys);

  await creat_conf_table();

  ob_ct.forEach((e, i) => {

    const data = {
      city_name: ob_ct[i],
      table_name: citys[ob_ct[i]],
      update_time: "0",
    };

    let sql = "INSERT INTO conf" + " SET ?";
    con.query(sql, data, function (error) {
      if (error) console.log("寫入conf預設資料失敗！");
    });

  });



}

//寫入更新時間到設定檔
function update_time(table, data) {
  let sql = "INSERT INTO " + table + " SET ?";
  con.query(sql, data, function (error) {
    if (err) console.log("寫入更新時間至conf失敗");
  });
}

//檢查更新時間
function update_check(city, update_time) {
  let sql =
    "SELECT update_time FROM  conf WHERE table_name = " + '"' + city + '"';
  return new Promise((resolve) => {
    console.log(city + "資料時間=" + update_time);
    con.query(sql, (error, results) => {
      if (!error) {
        if (results[0].update_time == update_time) {
          console.log("最新，不更新");
          resolve(false);
        } else {
          console.log("資料需要更新");
          conf_new_update_time(city, update_time);
          resolve(true);
        }
      } else console.log("查詢失敗");
    });
  });
}

//寫入更新時間
function conf_new_update_time(city, update_time) {
  const sql =
    " UPDATE conf SET update_time = " +
    '"' +
    update_time +
    '"' +
    "WHERE table_name = " +
    '"' +
    city +
    '"';

  con.query(sql, function (err) {
    if (err) throw err;
    else {
      console.log("時間寫入成功");
    }
  });
}