const Bcrypt = require('bcrypt');
const UserModel = require('../models/user.js');

exports.loginPost = async function(request, h){
	const { email, password } = request.payload;
    let message = "";
    if(!email || !password){
        message = "email or password is missing!";
        return h.view("login",{message})
    }
    const user = await UserModel.findOne({email:email}).exec();
    if(user){
        const isValid = await Bcrypt.compare(password,user.password);
        if(isValid){
            const uuid = user._id.toString();
            await request.server.app.cache.set(uuid,{email:email,password:""},0)
            request.cookieAuth.set({id:uuid});
            return h.redirect("/");
        }
        message = "password not match!"
        return h.view("login",{message})
    }
    message = "email not registered!"
    return h.view("login",{message})
}


exports.loginGet = async function(request, h){
	return h.view("login")
}


exports.registerPost = async function(request, h){
	let { email, password } = request.payload;
    let message = "";
    if(!email || !password){
        message = "email or password is missing!";
        return h.view("register",{message})
    }
    const user = await UserModel.findOne({email:email}).exec();
    if(!user){
        const salt = Bcrypt.genSaltSync(10);
        password = await Bcrypt.hash(password,salt);
        const user = await UserModel.create({
            email:email,
            password:password
        });
        const uuid = user._id.toString();
        await request.server.app.cache.set(uuid,{email:email,password:""},0);
        request.cookieAuth.set({id:uuid});
        return h.redirect("/");
    }
    message = "email have been registered!"
    return h.view("register",{message});
}

exports.registerGet = async function(request, h){
	return h.view("register")
}












