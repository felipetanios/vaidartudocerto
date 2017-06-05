var mongoose = require("mongoose");

mongoose.connect('mongodb://localhost:27017/AlunosDB');

var schema = mongoose.Schema;

var alunoSchema = {
    "ra": String,
    "nome": String,
    "curso": String
};

module.exports = mongoose.model('Alunos', alunoSchema);
