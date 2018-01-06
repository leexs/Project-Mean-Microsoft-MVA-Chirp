var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postSchema = new Schema({
	created_by: String,	
	created_at: {type: Date, default: Date.now},
	text: String
});

var Post = mongoose.model('Post', postSchema);

module.exports = Post;