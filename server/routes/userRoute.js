const userService = require("../services/userService.js");

module.exports = [
	//login
	{
		method: 'GET',
        path: "/login",
        handler: userService.loginGet,
        options: {
            auth: false,
            plugins: {
                rbac: 'none'
            }
        }
	},
	{
		method: 'POST',
		path: "/login",
		handler: userService.loginPost,
		options: {
		    auth: {
		        mode: "try"
		    },
		    plugins: {
		        rbac: 'none'
		    }
		}
	},
	//register
	{
		method: 'GET',
		path: "/register",
		handler: userService.registerGet,
		options: {
		    auth: false,
		    plugins: {
		        rbac: 'none'
		    }
		}
	},
	{
		method: 'POST',
		path: "/register",
		handler: userService.registerPost,
		options: {
		    auth: {
		        mode: "try"
		    },
		    plugins: {
		        rbac: 'none'
		    }
		}
	}

]

