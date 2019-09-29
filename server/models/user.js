const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const UserSchema = new Schema({
	password: { type: String, default: '', trim: true, maxlength: 400 },
	email: { type: String, default: '', trim: true, maxlength: 400 },
})


const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;