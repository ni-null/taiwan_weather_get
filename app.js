//module

const axios = require("axios")
const schedule = require("node-schedule")
const fs = require("fs")

//sql

const config_table = require("./part/config_table")
const city_table = require("./part/city_table")
const taiwan_table = require("./part/taiwan_table")

//創建設定檔
;(async () => {
  //獲取api_key
  let api_key

  try {
    api_key = await get_key()
  } catch {
    return
  }
  //創建設定檔
  const creat_conf_table_result = await config_table.creat_conf_table()

  //創建成功寫入資料
  if (creat_conf_table_result) await config_table.original_data_seting_conf()

  //創建所有天氣資料表
  await config_table.creat_weather_table()

  //抓取天氣
  schedule.scheduleJob("*/20 * * * * ", function () {
    console.log("執行時間: " + new Date())
    city_weather(api_key)
    get_taiwan_weather(api_key)
  })

  city_weather(api_key)
  get_taiwan_weather(api_key)
})()

//城市天氣  - 請求處理
async function city_weather(api_key) {
  for (let i = 3; i < 89; i += 4) {
    let city_code = "0" + i
    if (city_code.length < 3) city_code = "0" + city_code

    const url =
      "https://opendata.cwb.gov.tw/fileapi/v1/opendataapi/F-D0047-" + city_code + "?Authorization=" + api_key + "&downloadType=WEB&format=JSON"

    //請求間格
    try {
      await get_city_weather(url)
    } catch (err) {
      console.log(err)
    }
  }
}

//城市天氣  - 資料處理
function get_city_weather(url) {
  return new Promise(async (resolve, reject) => {
    //取得資料
    let responsed = await axios.get(url)
    responsed = responsed.data.cwbopendata.dataset

    //城市中文名
    const city_name_che = responsed.locations.locationsName

    //檢查更新時間，一致則返回
    const update_time = responsed.datasetInfo.update
    const last_update_time = await config_table.get_city_update_time_from_conf(city_name_che)
    if (last_update_time.update_time != update_time) console.log("更新天氣資料")
    else {
      setTimeout(() => {
        resolve()
      }, 200)
      return
    }

    //清空舊城市資料表，刪除失敗則返回
    const delete_result = await city_table.clear_table(city_name_che)
    if (!delete_result) return reject(city_name_che + "資料表清空失敗")

    //寫入天氣資料，失敗則返回

    const weather_data = responsed.locations.location

    const weather_data_load_result = await city_table.weather_data_load(weather_data, city_name_che)

    if (weather_data_load_result) console.log(city_name_che + " :資料更新成功")
    else return reject(city_name_che + "更新失敗")

    //寫入更新時間

    const update_time_result = await config_table.update_data_time(update_time, city_name_che)

    if (update_time_result) {
      console.log("更新時間狀態 \n\n\n")

      //延遲回傳結果

      setTimeout(() => {
        resolve(true)
      }, 200)
    }
  })
}

//城市天氣  - 資料處理
async function get_taiwan_weather(api_key) {
  const url = "https://opendata.cwb.gov.tw/fileapi/v1/opendataapi/F-D0047-091?Authorization=" + api_key + "&downloadType=WEB&format=JSON"

  //取得資料
  let responsed = await axios.get(url)
  responsed = responsed.data.cwbopendata.dataset

  //城市中文名
  const name_che = "台灣"

  return new Promise(async (resolve, reject) => {
    //檢查更新時間，一致則返回
    const update_time = responsed.datasetInfo.update
    const last_update_time = await config_table.get_city_update_time_from_conf(name_che)
    if (last_update_time.update_time != update_time) console.log("更新天氣資料")
    else {
      setTimeout(() => {
        resolve()
      }, 200)
      return
    }

    //清空台灣資料表，刪除失敗則返回
    const clear_result = await taiwan_table.clear_table(name_che)
    if (!clear_result) return reject(name_che + "資料表清空失敗")

    //寫入天氣資料，失敗則返回

    const weather_data = responsed.locations.location

    const taiwan_data_load_result = await taiwan_table.weather_data_load(weather_data, "taiwan")

    if (taiwan_data_load_result) console.log(" 台灣 :資料更新成功")
    else return reject("Error ! 台灣 :資料更新失敗")

    //寫入更新時間

    const update_time_result = await config_table.update_data_time(update_time, "台灣")

    if (update_time_result) {
      console.log("寫入更新時間 \n\n\n")

      //延遲回傳結果

      setTimeout(() => {
        resolve(true)
      }, 200)
    }
  })
}

//讀取api_key
function get_key() {
  return new Promise(async (resolve, reject) => {
    fs.open("./api_key.txt", function (err, fd) {
      if (err != null) {
        console.log("無偵測到api_key.txt，已終止")
        reject()
      } else {
        fs.readFile("./api_key.txt", function (err, data) {
          if (data.toString().length != 0) {
            resolve(data.toString())
          } else {
            console.log("api為空，已終止")
            reject()
          }
        })
      }
    })
  })
}
