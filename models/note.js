var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var NoteSchema = new Schema({

	title: {
		type: String
	},

	body : {
		type: String
	}
});

var note=mongoose.model("Note", NoteSchema);
module.exports = note;