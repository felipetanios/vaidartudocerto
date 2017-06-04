var mongoose = require("mongoose");

mongoose.Promise = global.Promise;

conn2 = mongoose.createConnection('mongodb://localhost:27017/trocasDB');

var Schema = mongoose.Schema;

var trocasSchema = new Schema({
    "idTrade":Number,
    "UserReq": String,
    "UserResp": String,
    "titleBook": String
});

module.exports = conn2.model('trocas', trocasSchema);

/* 
	JSON para TESTES no mr.html:

	{"idTrade": 1, "UserReq":"Miguel", "UserResp":"Gomide", "titleBook":"Introducao a normalizacao de notas"}

*/