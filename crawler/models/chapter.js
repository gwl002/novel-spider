const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const ChapterSchema = new Schema({
	title: { type: String, default: '', trim: true, maxlength: 400 },
  	createdAt: {type: Date,default: Date.now},
  	content: { type: String, default:'', trim: false, maxlength: 50000 },
  	url: { type: String, default:'', trim: true, maxlength: 100 },
  	book: { type: Schema.Types.ObjectId, ref: 'Book' },
  	index: { type: Number, default: 0},
  	spider: { type: String, default:'', trim: true, maxlength: 100 } 			 	
})


const ChapterModel = mongoose.model('Chapter', ChapterSchema);

module.exports = ChapterModel;
