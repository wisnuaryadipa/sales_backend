const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    id_user: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        required: true
    },
    no_telp: String,
    jabatan: String,
    status: Number,
    created_at: Date,
    updated_at: Date

})

module.exports = mongoose.model('User', userSchema)