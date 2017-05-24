var mongoose = require("mongoose");
mongoose.connect('mongodb://localhost:27017/alunosDB');

var schema = mongoose.Schema;
var copiesSchema = {
    "owner": String,
    "title": String,
    "author": String,
    "area": String
};
module.exports = mongoose.model('copies', copiesSchema);

var userSchema = {
    "user": String,
    "password": String,
    "name": String
};
module.exports = mongoose.model('users', userSchema);
