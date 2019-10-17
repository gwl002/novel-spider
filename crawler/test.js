var _eval = require("eval");




let code = `
	var rs = require("request-promise-native");
	

	async function rq(){
		var str = await rs({
			uri:"http://www.baidu.com"
		})
		console.log(str)
	}

	rq();
	
`


var res = _eval(code,true);




