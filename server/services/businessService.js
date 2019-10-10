const Bcrypt = require('bcrypt');
const UserModel = require('../models/user.js');
const BookModel = require("../models/book.js");


exports.home = async function(request, h){
	const items = await BookModel.find().exec();
	return h.view("home",{
		items
	})
}


exports.book = async function(request, h){
	const book =await BookModel.findOne({_id:request.params.bookId}).exec();
	return h.view("book",{
		title:book.title,
		book
	})
}