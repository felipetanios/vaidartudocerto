var mongoose = require("mongoose");

mongoose.Promise = global.Promise;

conn1 = mongoose.createConnection('mongodb://localhost:27017/booksDB');

var Schema = mongoose.Schema;

var bookSchema = new Schema({
    "owner": String,
    "author": String,
    "area": String,
    "title": String
});

module.exports = conn1.model('books', bookSchema);

/* 
	JSON para TESTES no mr.html:

	{"owner":"João", "title":"Pé de Feijão"}
	{"owner":"Eleri", "title":"Eng. de Software para Leigos"}
	{"owner":"Gomide", "title":"A espera de um Milagre"}
	{"owner":"Pedro", "title":"Dom Casmurro"}

*/