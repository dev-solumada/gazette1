const mongoose = require('mongoose');

const User = mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    password: String,
    user_type: {
        type: Boolean,
        default: true,
    },
})
module.exports = mongoose.model('datauser',User);