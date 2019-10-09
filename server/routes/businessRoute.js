module.exports = [
	{
		method: 'GET',
		path: '/',
		handler: function (request, h) {
		    return h.view("home")
		}
	},
	{
		method: 'GET',
		path: "/about",
		handler: function (request, h) {
		    return h.view("about")
		}
	}
] 

