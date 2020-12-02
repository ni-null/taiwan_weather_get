//開放資料api_key
function get_city_weather(api_key) {

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
        console.log("網址獲取失敗 : " + opendata_url);
    });

    if (pagedata == null) return

    const pageinfo = pagedata.data.cwbopendata.dataset

    // 取得城市名，查詢縣市英文

    city = citys[pageinfo.locations.locationsName];

    // 取得更新時間
    let update = pageinfo.datasetInfo.update;

    update = update_time_filter(update);

    // 檢查更新時間
    const need_update = await update_check(city, update);

    if (need_update == false) return;


    //檢查table是否存在沒有則創建
    await check_table(city);



    //鄉鎮市的天氣
    const weather = pagedata.data.cwbopendata.dataset.locations.location;

    weather.forEach((e, i) => {


        e.weatherElement[0].time.forEach((s, n) => {

            const locationName = e.locationName;

            //獲取時間，並處理
            const time = time_filter(e.weatherElement[0].time[n].startTime);
            const time_1 = time[0]
            const time_2 = time[1]

            //獲取氣溫
            const T = e.weatherElement[0].time[n].elementValue.value;

            //獲取降雨機率
            const PoP12h = e.weatherElement[9].time[n].elementValue.value;

            //獲取降雨機率
            const WeatherDescription =
                e.weatherElement[12].time[n].elementValue[0].value



            //整理數據
            const data = {
                cityname: locationName,
                temp: T,
                rain: PoP12h,
                time_1: time_1,
                time_2: time_2,
                WeatherDescription: WeatherDescription,
            };

            //傳送寫入請求
            add_city_table_data(city, data);
        });

    });
}