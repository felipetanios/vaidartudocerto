var mongoose = require("mongoose");

mongoose.Promise = global.Promise;

usermongo = mongoose.createConnection('mongodb://localhost:27017/UsersDB');

var Schema = mongoose.Schema;

var alunoSchema = new Schema({
    "user": String,
    "password": String
});

module.exports = usermongo.model('Alunos', alunoSchema);

/*
{"user": "felipe", "password": "senha"}
{"user": "feec", "password": "feec"}
*/
