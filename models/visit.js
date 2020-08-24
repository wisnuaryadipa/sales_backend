const mongoose = require('mongoose')

const visitSchema = new mongoose.Schema({
    id_visit: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        required: true
    },
    id_user: Number,
    id_toko: Number,
    deskripsi: String,
    status_purpose: Number,
    lat: String,
    lng: String,
    is_status_change: Number,
    status: Number,
    created_at: Date,
    updated_at: Date,
    id_customer: Number

})

module.exports = mongoose.model('Toko', tokoSchema)