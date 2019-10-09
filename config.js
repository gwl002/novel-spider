module.exports = {
	//mongoose.connect('mongodb://username:password@host:port/database?options...');
	mongo: `mongodb://149.28.149.49:27017/novel`,
	redis:{
		port:6379,
	  	host:"149.28.149.49",
	  	password:"gwl002.tk",
	  	db:0
	},
	goEasy:{
		subKey: "BS-2be3e03d374340849a09e6b44308a503",
		pubKey: "BC-09b2c974fff24e639d52c2e849d47d44",
		cdnHost: "cdn-hangzhou.goeasy.io",
		restHost: "rest-hangzhou.goeasy.io",
	}
}