const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const BookSchema = new Schema({
	title: { type: String, default: '', trim: true, maxlength: 400 },
  	author: { type: String, default: '', trim: true, maxlength: 100 },
  	createdAt: {type: Date,default: Date.now},
  	imgSrc: { type: String, default:'', trim: true, maxlength: 100 },
  	url: { type: String, default:'', trim: true, maxlength: 100 },
  	updatedAt: { type: String, default:'', trim: true, maxlength: 100 },
  	brief: { type: String, default:'', trim: true, maxlength: 400 }
})


const BookModel = mongoose.model('Book', BookSchema);

module.exports = BookModel;