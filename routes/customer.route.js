/*
    Rute: /api/customer
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validateField } = require('../middlewares/validate-field');

const { getCustomers, getCustomerById, createCustomer, updateCustomer, deleteCustomer } = require('../controllers/customer.controller');
const { validateJWT } = require('../middlewares/validate-jwt');

const router = Router();

router.get('/', validateJWT, getCustomers);
router.get('/:id', validateJWT, getCustomerById);

router.post('/',
    [
        validateJWT,
        check('firstName', 'The first name is require').not().isEmpty(),
        check('lastName', 'The last name is require').not().isEmpty(),
        validateField
    ],
    createCustomer
);

router.put('/:id',
    [
        validateJWT,
        check('firstName', 'The first name is require').not().isEmpty(),
        check('lastName', 'The last name is require').not().isEmpty(),
        validateField
    ],
    updateCustomer
);

router.delete('/:id', 
    validateJWT,
    deleteCustomer
);


module.exports = router;