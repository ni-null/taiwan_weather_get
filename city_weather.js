//開放資料api_key
function get_city_weather(key) {
    const api_key = key;
    for (let i = 3; i < 89; i += 4) {
        let city_code = "0" + i;

        if (city_code.length < 3) city_code = "0" + city_code;

        const opendata_url =
            "https://opendata.cwb.gov.tw/fileapi/v1/opendataapi/F-D0047-" +
            city_code +
            "?Authorization=" +
            api_key +
            "&downloadType=WEB&format=JSON";

        //請求間格
        setTimeout(function () {
            process_city_data(opendata_url);
        }, i * 500);
    }
}

//傳入城市api網址並解析,建立資料庫及寫入對應資料
async function process_city_data(opendata_url) {
    console.log("");
    console.log("");
    //取得資料，若沒取到就終止
    const pagedata = await axios({
        method: "get",
        url: opendata_url,
        "Content-Type": "application/json",
    }).catch((err) => {
        console.log("失敗");
        console.log(opendata_url);
    });
    if (pagedata == null) return;

    // 取得城市名
    let locationsName = pagedata.data.cwbopendata.dataset.locations.locationsName;

    //查詢縣市英文
    city = citys[locationsName];

    // 取得資料時間
    let update = pagedata.data.cwbopendata.dataset.datasetInfo.update;

    update = update_time_filter(update);

    //檢測資料變動
    const need_update = await update_check(city, update);

    if (need_update == false) return;

    //鄉鎮市的天氣
    const weather = pagedata.data.cwbopendata.dataset.locations.location;

    //僅查資料庫table是否存在沒有則創建
    await check_table(city);

    //依照鄉鎮寫入天氣資料
    for (let i = 0; i < weather.length; i++) {
        for (let n = 0; n < weather[i].weatherElement[0].time.length; n++) {
            const locationName = weather[i].locationName;

            //獲取時間，並處理
            let startTime = weather[i].weatherElement[0].time[n].startTime;
            let endTime = weather[i].weatherElement[0].time[n].endTime;


            const time = star_end_time_filter(startTime, endTime);

            //獲取氣溫
            const T = weather[i].weatherElement[0].time[n].elementValue.value + "";

            //獲取降雨機率
            const PoP12h =
                weather[i].weatherElement[9].time[n].elementValue.value + "";

            //獲取降雨機率
            const WeatherDescription =
                weather[i].weatherElement[14].time[n].elementValue.value.split(
                    "。"
                )[0] + "";

            //整理數據
            const data = {
                cityname: locationName,
                temp: T,
                rain: PoP12h,
                time: time,
                WeatherDescription: WeatherDescription,
            };

            //傳送寫入請求
            add_city_table_data(city, data);
        }
    }
}