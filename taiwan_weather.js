//傳入城市api網址並解析,建立資料庫及寫入對應資料
async function get_taiwan_weather(api_key) {
    const opendata_url =
        "https://opendata.cwb.gov.tw/fileapi/v1/opendataapi/F-C0032-001?Authorization=" +
        api_key +
        "&downloadType=WEB&format=JSON";

    //取得資料，若沒取到就終止
    const pagedata = await axios({
        method: "get",
        url: opendata_url,
        "Content-Type": "application/json",
    }).catch((err) => {
        console.log("網址獲取失敗 : " + opendata_url);
    });
    if (pagedata == null) return



    // 取得更新時間
    let update = pagedata.data.cwbopendata.dataset.datasetInfo.update;

    update = update_time_filter(update);

    // 檢查更新時間
    const need_update = await update_check('taiwan', update);

    if (need_update == false) return;


    //檢查table是否存在沒有則創建
    await check_taiwan_table()

    const weather = pagedata.data.cwbopendata.dataset.location

    weather.forEach(e => {


        const locationName = e.locationName

        const MinT = e.weatherElement.find(x => x.elementName === 'MinT')
        const MaxT = e.weatherElement.find(x => x.elementName === 'MaxT')
        const PoP = e.weatherElement.find(x => x.elementName === 'PoP')
        const Wx = e.weatherElement.find(x => x.elementName === 'Wx')



        for (let i = 0; i < 3; i++) {

            const temp = MinT.time[i].parameter.parameterName + "~" + MaxT.time[i].parameter.parameterName

            const PoP12 = PoP.time[i].parameter.parameterName

            const startTime = PoP.time[i].startTime
            const endTime = PoP.time[i].endTime
            const time = star_end_time_filter(startTime, endTime)

            const WeatherDescription = Wx.time[i].parameter.parameterName




            const data = {
                cityname: locationName,
                temp: temp,
                rain: PoP12,
                time: time,
                WeatherDescription: WeatherDescription,
            }


            add_taiwan_table_data(data);

        }



    });


}