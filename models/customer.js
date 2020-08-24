const mongoose = require('mongoose')

const customerSchema = new mongoose.Schema({
    id_customer: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        required: true
    },
    status: Number,
    no_telp: String,
    created_at: Date,
    created_ats: String,
    updated_at: Date

})

module.exports = mongoose.model('Customer', customerSchema)