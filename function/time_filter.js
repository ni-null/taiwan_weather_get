//處理更新時間格式
function update_time_filter(update_time) {
  update_time = update_time.replace("2020-", "");
  update_time = update_time.replace("+08:00", "");

  return update_time;
}

//處理時間格式
function time_filter(startTime) {
  let startTime_arry = startTime.split("T");



  startTime_arry[0] = startTime_arry[0].replace("2020-", "");
  startTime_arry[1] = startTime_arry[1].replace("18:00:00+08:00", "晚上");
  startTime_arry[1] = startTime_arry[1].replace("12:00:00+08:00", "午後");
  startTime_arry[1] = startTime_arry[1].replace("06:00:00+08:00", "早上");
  startTime_arry[1] = startTime_arry[1].replace("00:00:00+08:00", "凌晨");

  let day = dayjs(startTime, "	Asia/Taipei").day();

  //判斷今天明天
  const now = dayjs(startTime, "	Asia/Taipei");


  if (now.isToday()) startTime_arry[2] = "今天";
  else if (now.isTomorrow()) startTime_arry[2] = "明天";

  switch (day) {
    case 1:
      {
        startTime_arry[3] = "一";
      }
      break;
    case 2:
      {
        startTime_arry[3] = "二";
      }
      break;
    case 3:
      {
        startTime_arry[3] = "三";
      }
      break;
    case 4:
      {
        startTime_arry[3] = "四";
      }
      break;
    case 5:
      {
        startTime_arry[3] = "五";
      }
      break;
    case 6:
      {
        startTime_arry[3] = "六";
      }
      break;
    case 0:
      {
        startTime_arry[3] = "日";
      }
      break;

    default:
      break;
  }

  return startTime_arry;
}
