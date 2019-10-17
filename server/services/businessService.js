const Bcrypt = require('bcrypt');
const UserModel = require('../models/user.js');
const BookModel = require("../models/book.js");
const ChapterModel = require("../models/chapter.js");


exports.home = async function(request, h){
	const items = await BookModel.find().exec();
	console.log(request.info.remoteAddress);
	console.log(request.headers["x-forwarded-for"]);
	return h.view("home",{
		items
	})
}


exports.book = async function(request, h){
	try{
		const book =await BookModel.findOne({_id:request.params.bookId}).exec();
		const chapters = await ChapterModel.find({book:book._id},'title index').exec();
		if(book){
			return h.view("book",{
				book,
				chapters
			});
		}else{
			return h.view("404").code(404);
		}
	}catch(err){
		return h.view("404").code(404);
	}
}


exports.chapter = async function(request, h){
	try{
		const chapter = await ChapterModel.findOne({_id: request.params.chapterId}).exec();
		if(chapter){
			return h.view("chapter",{
				chapter
			})
		}else{
			return h.view("404").code(404);
		}
	}catch(err){
		return h.view("404").code(404);
	}
}