var rp = require('../crawler/node_modules/request-promise-native');

var config = require('../config.js');

async function publishNotification(channel,content){
	try{
		let result = await rp({
			method:"POST",
			uri: "http://" + config.goEasy.restHost + "/publish",
			form:{
				appKey: config.goEasy.pubKey,
				channel,
				content
			}
		})
		return result;
	}catch(err){
		console.log(err);
		throw err;
	}
	
	
}


publishNotification("test","hello")


module.exports = publishNotification