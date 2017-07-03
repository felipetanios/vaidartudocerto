var mongoose = require("mongoose");

mongoose.Promise = global.Promise;

conn = mongoose.createConnection('mongodb://localhost:27017/copiesDB');

var Schema = mongoose.Schema;

var copiesSchema = new Schema({
    "owner": String,
    "bookID": Number,
    "copyID": Number
    //"book": {type: mongoose.Schema.Types.ObjectID, ref: "title"}

});

module.exports = conn.model('copies', copiesSchema);

