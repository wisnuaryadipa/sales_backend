const request = require('request');
const _ = require('underscore');
const Toko = require('../../models/toko');
const Mongoose = require('mongoose');
const Moment = require('moment');




var data = {


    index : (req, res, next) => {

        Toko.find()
        .exec()
        .then(docs => {
            console.log(docs);
            res.status(200).json({docs});
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
    },

    pagination : (req, res, next) => {
        
        res.json(res.paginatedResults)
    },

    createPage : (req, res, next) => {
        

        res.send('POST request to the homepage')
    },

    create : (req, res, next) => {
        
        const toko = new Toko({
            _id: new Mongoose.Types.ObjectId(),
            name: req.body.name,
            alamat: req.body.alamat,
            no_telp: req.body.no_telp,
            kota: req.body.kota,
            lat: req.body.lat,
            lng: req.body.lng,
            created_at: Date.now(),
            updated_at: Date.now(),
            status: 1,
            id_customer: req.body.customerId,
        });

        toko.save().then( result => {
            console.log(result);

        }).catch(err => console.log(err));
        
        let _toko = toko;
        _toko.created_ats = Moment(_toko.created_at).format('MMMM Do YYYY, h:mm:ss a');
        res.status(201).json({
            message: "Handling Post request to /toko",
            createdProduct: _toko
        })
    },

    update : (req, res, next) => {

        const id = req.params.tokoId;
        const updateOps = {};

        updateOps['updated_at'] = Date.now();

        for ( const ops of req.body ) {
            updateOps[ops.propName] = ops.value;
        }
        
        Toko.update({ _id: id}, { $set: updateOps })
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json(result)
        })
        .catch( err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        })
        
        
    },

    detail : (req, res, next) => {
        const id = req.params.tokoId;
        console.log(id)
        Toko.findById(id)
        .exec()
        .then(doc => {
            console.log(doc);
            if(doc) {
                res.status(200).json({doc});
            } else {
                res.status(404).json({message: 'No valid entry found for provided ID'})
            }

        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
    }
    


}


module.exports = data;