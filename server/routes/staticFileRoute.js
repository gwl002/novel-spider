const Boom = require("boom");

module.exports =[
	{
		method: 'GET',
        path: '/public/{param*}',
        handler: {
            directory: {
                path: '.',
                redirectToSlash: true
                // listing: true
            }
        },
        options: {
            auth: false,
            plugins: {
                rbac: 'none'
            }
        }
	},
    {
        method: "GET",
        path: "/{path*}",
        handler:(request, h) => {
            const accept = request.headers.accept;
            if(accept && accept.match(/json/) ){
                return Boom.notFound("This path is not found!")
            }
            return h.view("404").code(404);
        },
        options: {
            auth: false,
            plugins: {
                rbac: 'none'
            }
        }
    }
]



