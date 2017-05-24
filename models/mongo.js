var mongoose = require("mongoose");

mongoose.Promise = global.Promise;

conn1 = mongoose.createConnection('mongodb://localhost:27017/exemplaresDB');

var Schema = mongoose.Schema;

var exemplaresSchema = new Schema({
    "nExemplar": Number,
    "title": String,
    "author": String,
    "area": String
});

module.exports = conn1.model('exemplares', exemplaresSchema);

/* 
	{"nExemplar":"123", "title":"Hello", "author":"João", "area":"História"}


	{"owner":"Pedro", "nLivro":"333","nExemplar":"123"}

*/