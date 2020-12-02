//處理更新時間格式
function update_time_filter(update_time) {
  update_time = update_time.replace("2020-", "");
  update_time = update_time.replace("+08:00", "");

  return update_time;
}



//處理時間格式
function star_end_time_filter(startTime) {

  let startTime_arry = startTime.split("T");

  startTime_arry[0] = startTime_arry[0].replace("2020-", "");
  startTime_arry[1] = startTime_arry[1].replace("18:00:00+08:00", "晚上");
  startTime_arry[1] = startTime_arry[1].replace("12:00:00+08:00", "午後");
  startTime_arry[1] = startTime_arry[1].replace("06:00:00+08:00", "早上");
  startTime_arry[1] = startTime_arry[1].replace("00:00:00+08:00", "凌晨");


  return (
    startTime_arry[0] +
    ":" +
    startTime_arry[1]
  );
}