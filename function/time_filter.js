//處理更新時間格式
function update_time_filter(update_time) {
  update_time = update_time.replace("2020-", "");
  update_time = update_time.replace("+08:00", "");

  return update_time;
}



//處理時間格式
function star_end_time_filter(startTime, endTime) {

  let startTime_arry = startTime.split("T");
  let endTime_arry = endTime.split("T");

  startTime_arry[0] = startTime_arry[0].replace("2020-", "");
  startTime_arry[1] = startTime_arry[1].replace("18:00:00+08:00", "晚上6點");
  startTime_arry[1] = startTime_arry[1].replace("12:00:00+08:00", "中午12點");
  startTime_arry[1] = startTime_arry[1].replace("06:00:00+08:00", "早上6點");
  startTime_arry[1] = startTime_arry[1].replace("00:00:00+08:00", "凌晨12點");

  endTime_arry[0] = endTime_arry[0].replace("2020-", "");
  endTime_arry[1] = endTime_arry[1].replace("18:00:00+08:00", "晚上6點");
  endTime_arry[1] = endTime_arry[1].replace("12:00:00+08:00", "中午12點");
  endTime_arry[1] = endTime_arry[1].replace("06:00:00+08:00", "早上6點");

  return (
    startTime_arry[0] +
    ":" +
    startTime_arry[1] +
    "~" +
    endTime_arry[0] +
    ":" +
    endTime_arry[1]
  );
}


function taiwan_star_end_time_filter(startTime, endTime) {



  startTime = startTime.replace("2020-", "")
  startTime = startTime.replace("18:00:00", "晚上6點")
  startTime = startTime.replace("12:00:00", "中午12點")
  startTime = startTime.replace("06:00:00", "早上6點")
  startTime = startTime.replace("00:00:00", "凌晨12點")

  endTime = endTime.replace("2020-", "");
  endTime = endTime.replace("18:00:00", "晚上6點");
  endTime = endTime.replace("12:00:00", "中午12點");
  endTime = endTime.replace("06:00:00", "早上6點");

  return startTime + "~" + endTime;
}