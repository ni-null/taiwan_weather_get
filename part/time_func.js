const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc"); // dependent on utc plugin
const timezone = require("dayjs/plugin/timezone");
const isToday = require("dayjs/plugin/isToday");
dayjs.extend(isToday);
const isTomorrow = require("dayjs/plugin/isTomorrow");
dayjs.extend(isTomorrow);


module.exports = {
    //處理時間格式
    time_filter: function (startTime) {




        let startTime_arry = startTime.split("T");

        startTime_arry[0] = (dayjs(startTime).format('M') + '-' + dayjs(startTime).format('D'))
        startTime_arry[1] = startTime_arry[1].replace("18:00:00+08:00", "晚上");
        startTime_arry[1] = startTime_arry[1].replace("12:00:00+08:00", "午後");
        startTime_arry[1] = startTime_arry[1].replace("06:00:00+08:00", "早上");
        startTime_arry[1] = startTime_arry[1].replace("00:00:00+08:00", "凌晨");

        let day = dayjs(startTime, "Asia/Taipei").day();

        //判斷今天明天
        const now = dayjs(startTime, "	Asia/Taipei");

        //後天
        let after_tomorrow = dayjs().add(2, "day").$d;
        after_tomorrow = (dayjs(after_tomorrow).format('M') + '-' + dayjs(after_tomorrow).format('D'))



        if (now.isToday()) startTime_arry[2] = "今天";
        else if (now.isTomorrow()) startTime_arry[2] = "明天";
        else if (startTime_arry[0] == after_tomorrow) startTime_arry[2] = "後天";
        else startTime_arry[2] = '';

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
}