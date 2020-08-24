const mongoose = require('mongoose')

const tokoSchema = new mongoose.Schema({
    id_toko: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        required: true
    },
    alamat: String,
    no_telp: String,
    kota: String,
    lat: String,
    lng: String,
    status: Number,
    created_at: Date,
    updated_at: Date,
    id_customer: Number

})

module.exports = mongoose.model('Toko', tokoSchema)