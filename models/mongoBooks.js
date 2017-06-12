var mongoose = require("mongoose");

mongoose.Promise = global.Promise;

conn1 = mongoose.createConnection('mongodb://localhost:27017/booksDB');

var Schema = mongoose.Schema;

var bookSchema = new Schema({
    //"owner": String,
    "author": String,
    "area": String,
    "bookID": Number,
    "title": String
});

module.exports = conn1.model('books', bookSchema);

/* 
	JSON para TESTES no mr.html:
	{"author":"Christian", "area":"Sofrência", "title":"A espera de um Milagre"}
	{"author":"Machado de Assis", "area":"Literatura", "title":"Dom Casmurro"}

*/