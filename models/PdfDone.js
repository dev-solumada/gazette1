const mongoose = require('mongoose');

const PdfDone = mongoose.Schema({
    name: String,
    treated_by: String,
    version:Number
})
module.exports = mongoose.model('PdfDone',PdfDone);