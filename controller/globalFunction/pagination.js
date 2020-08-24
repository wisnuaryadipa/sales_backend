
const _ = require('underscore');

const limit_ = 2;

var data = {
    
    
    paginatedResult : (model) => {

        return (req, res, next) => {
            
            let _model = model;

            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || limit_;
            const sortBy = req.query.sortBy || 'name';
            const orderBy = req.query.orderBy === 'desc' ? -1 : 1;
            const filter = req.query.filter.toLowerCase() || '';
            // const allKeysModel = _.keys(model);
        
            const results = {
                results: {},
                options: {}
            }

            // Filter function for search
            _model = _model.filter((item) => {
                return Object.keys(item).some((key) => {
                    return String(item[key]).toLowerCase().indexOf(filter) > -1;
                })
            })
            
            const startIndex = (page - 1) * limit
            const endIndex = page * limit
            const countAllPages = Math.ceil(_model.length / limit)

            console.log(_model)
            // Sort and Order function
            if(orderBy == 1)
                _model = _.sortBy(_model, sortBy);
            else 
                _model = _.sortBy(_model, sortBy).reverse();


            // Add result option for the next page and declare limit 
            if (endIndex < _model.length) {
                results.options.next = {
                    page: page + 1,
                    limit: limit
                }
            }

            if (startIndex > 0) {
                results.options.previous = {
                    page: page - 1,
                    limit: limit
                }
            }

            /* ADD OPTION VALUE */
            results.options.countAllPages = countAllPages

            
    
            results.results = _model.slice(startIndex, endIndex);

            res.paginatedResults = results;
            next();
        }
        
    }
}


module.exports = data;