const request = require('request');
const _ = require('underscore');
const Visit = require('../../models/visit');
const Mongoose = require('mongoose');
const Moment = require('moment');




var data = {


    index : (req, res, next) => {

        Visit.find()
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
        
        const visit = new Visit({
            _id: new Mongoose.Types.ObjectId(),
            name: req.body.name,
            no_telp: req.body.no_telp,
            created_at: Date.now(),
            updated_at: Date.now(),
            status: 1,
        });

        visit.save().then( result => {
            console.log(result);

        }).catch(err => console.log(err));
        
        let _visit = visit;
        _visit.created_ats = Moment(_visit.created_at).format('MMMM Do YYYY, h:mm:ss a');
        res.status(201).json({
            message: "Handling Post request to /visit",
            createdProduct: _visit
        })
    },

    update : (req, res, next) => {

        const id = req.params.visitId;
        const updateOps = {};

        updateOps['updated_at'] = Date.now();

        for ( const ops of req.body ) {
            updateOps[ops.propName] = ops.value;
        }
        
        Visit.update({ _id: id}, { $set: updateOps })
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
        const id = req.params.visitId;
        console.log(id)
        Visit.findById(id)
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