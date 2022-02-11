const mongoose = require('mongoose');

const PdfDone = mongoose.Schema({
    name: String,
    treated_by: String,
    version: Number,
    _date: {
        type: Date,
        default: Date.now()
    },
})
module.exports = mongoose.model('PdfDone',PdfDone);