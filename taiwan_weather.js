//傳入城市api網址並解析,建立資料庫及寫入對應資料
async function get_taiwan_weather(key) {
    const api_key = key;
    const opendata_url =
        "https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=" +
        api_key +
        "&downloadType=WEB&format=JSON";

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



    console.log(pagedata.data.records.location[0])


    await check_taiwan_table()

    pagedata.data.records.location.forEach(e => {


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
            const time = taiwan_star_end_time_filter(startTime, endTime)

            const WeatherDescription = Wx.time[i].parameter.parameterName


            console.log(locationName)
            console.log("平均溫度" + temp)
            console.log("降雨機率" + PoP12)
            console.log("天氣狀態 : " + WeatherDescription)
            console.log(time)

            console.log("")
            console.log("")

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

    //創建資料表





}