var mongoose = require("mongoose");

mongoose.Promise = global.Promise;

conn2 = mongoose.createConnection('mongodb://localhost:27017/livrosDB');

var Schema = mongoose.Schema;

var livrosSchema = new Schema({
    "owner": String,
    "nLivro": Number,
    "nExemplar": Number
    
});

module.exports = conn2.model('livros', livrosSchema);
