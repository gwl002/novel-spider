const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const ChapterSchema = new Schema({
	title: { type: String, default: '', trim: true, maxlength: 400 },
  	author: { type: String, default: '', trim: true, maxlength: 100 },
  	createdAt: {type: Date,default: Date.now},
  	content: { type: String, default:'', trim: true, maxlength: 50000 },
  	url: { type: String, default:'', trim: true, maxlength: 100 },
  	updatedAt: { type: String, default:'', trim: true, maxlength: 100 },
  	book: { type: Schema.Types.ObjectId, ref: 'Book' },
  	index: { type: Number, default: 0} 			 	
})


const ChapterModel = mongoose.model('Chapter', BookSchema);

module.exports = ChapterModel;