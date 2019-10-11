const businessService = require("../services/businessService.js");


module.exports = [
	{
		method: 'GET',
		path: '/',
		handler: businessService.home
	},
	{
		method: 'GET',
		path: "/book/{bookId}",
		handler: businessService.book
	},
	{
		method: 'GET',
		path: "/chapter/{chapterId}",
		handler: businessService.chapter
	},
] 

