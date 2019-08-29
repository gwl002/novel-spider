var moment = require("moment");

let now = new Date();
let yesterday = moment().subtract(1,"days");
let inweekday = moment().subtract(2,"days");
let someday = moment().subtract(4,"days");

const weekdays = {
	"en":["Sunday","Monday","Tuesday","Wednesday","Thurday","Friday","Saturday"],
	"zh":["星期天","星期一","星期二","星期三","星期四","星期五","星期六"]
}

function formatNotificationDate(date,lang){
	let now = new Date();
	let yesterday = moment(now).subtract(1,"days");
	if(moment(date).isSame(moment(now),"day")){
		let hours = moment(date).hours();
		let minutes = moment(date).minutes();
		let show;
		if(lang === "en"){
			show = hours>12?"pm":"am";
			hours = hours>12?hours-12:hours;
			return `${hours}:${minutes} ${show}`
		}else{
			let show = hours>12?"下午":"上午";
			hours = hours>12?hours-12:hours;
			return `${show} ${hours}:${minutes}`
		}
	}else if(moment(date).isSame(yesterday,"day")){
		if(lang === "en"){
			return "Yesterday"
		}else{
			return "昨天"
		}
	}else if(moment(date).isSame(moment(now),"week")){
		let weekday = moment(date).weekday();
		if(lang === "en"){
			return weekdays["en"][weekday]
		}else{
			return weekdays["zh"][weekday]
		}
	}else{
		if(lang === "en"){
			return moment(date).format("DD-MMM-YYYY")
		}else{
			let year = moment(date).format("YYYY");
			let month = moment(date).format("MM");
			let day = moment(date).format("DD")
			return `${year}年${month}月${day}日`;
		}
	}
}

