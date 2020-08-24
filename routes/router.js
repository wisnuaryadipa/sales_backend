const express = require('express');
const fs = require('fs');
const http = require('http');
const path = require('path');
const master = require('./master');
const router = express.Router();
const request = require('request');
const mongoose = require('mongoose')
const User = require('../models/user');
const { ENV, PORT, MONGO_ATLAS_DBNAME, MONGO_ATLAS_PW, MONGO_ATLAS_USERNAME} = require('../config');

console.log(MONGO_ATLAS_DBNAME)
mongoose.connect('mongodb+srv://'+
    MONGO_ATLAS_USERNAME + 
    ':'+ 
    MONGO_ATLAS_PW + 
    '@alphabeth-i35ed.mongodb.net/' + 
    MONGO_ATLAS_DBNAME + 
    '?retryWrites=true&w=majority', { 
        useNewUrlParser: true, 
        useUnifiedTopology: true 
    }
)
const db = mongoose.connection
db.once('open', async () => {

    if (await User.countDocuments().exec() > 0) 
        console.log('Users collection already exist')
    else
        Promise.all([
            User.create({ name: 'User 1' }),
            User.create({ name: 'User 2' }),
            User.create({ name: 'User 3' }),
            User.create({ name: 'User 4' }),
            User.create({ name: 'User 5' }),
            User.create({ name: 'User 6' }),
            User.create({ name: 'User 7' }),
            User.create({ name: 'User 8' }),
            User.create({ name: 'User 9' }),
            User.create({ name: 'User 10' }),
            User.create({ name: 'User 11' }),
            User.create({ name: 'User 12' })
        ]).then(() => console.log('Added Users'));

})


router.get('/', function(req, res) {
    res.send('Test Index');
});

router.use('/master', master);


//export this router to use in our index.js
module.exports = router;