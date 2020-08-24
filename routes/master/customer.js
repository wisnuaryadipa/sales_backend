const express = require('express');
const router = express.Router();
const glbPagination = require('../../controller/globalFunction/pagination');
const ControlerCustomer = require('../../controller/master/customer');

var users = [
    { id: 1, name: 'Post 1', created_at: '', updated_at: '', status: ''},
    { id: 2, name: 'Post 2'},
    { id: 3, name: 'Post 9'},
    { id: 4, name: 'Post 4'},
    { id: 5, name: 'Post 5'},
    { id: 6, name: 'Post 6'},
    { id: 7, name: 'Post 7'},
    { id: 8, name: 'Post ada'},
    { id: 9, name: 'Post ada apa'}
];

router.get('/', ControlerCustomer.index);
router.get('/:customerId', ControlerCustomer.detail);
router.get('/pagination', glbPagination.paginatedResult(users), ControlerCustomer.pagination);
router.post('/create', ControlerCustomer.create);
router.patch('/:customerId', ControlerCustomer.update);


module.exports = router