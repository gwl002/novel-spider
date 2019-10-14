const moment = require("moment");


module.exports = function(date,format){
	if(!format){
		format = "YYYY-MM-DD hh:mm"
	}
	return moment(date).format(format);
}