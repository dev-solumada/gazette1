const mongoose = require('mongoose');

const User = mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    password:String,
})
module.exports = mongoose.model('datauser',User);