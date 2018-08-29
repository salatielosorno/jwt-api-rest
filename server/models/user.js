var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    email:String,
    pass:String
});

module.exports = mongoose.model('User', userSchema);