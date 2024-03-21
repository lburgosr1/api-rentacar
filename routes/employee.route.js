/*
    Rute: /api/employee
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validateField } = require('../middlewares/validate-field');

const { validateJWT } = require('../middlewares/validate-jwt');
const { deleteEmployee, updateEmployee, createEmployee, getEmployeeById, getEmployees } = require('../controllers/employee.controller');

const router = Router();

router.get('/', validateJWT, getEmployees);
router.get('/:id', validateJWT, getEmployeeById);

router.post('/',
    [
        validateJWT,
        check('firstName', 'The first name is require').not().isEmpty(),
        check('lastName', 'The last name is require').not().isEmpty(),
        check('document', 'The document is require').not().isEmpty(),
        check('typeDocument', 'The type document is require').not().isEmpty(),
        check('address', 'The address is require').not().isEmpty(),
        check('phone', 'The phone is require').not().isEmpty(),
        validateField
    ],
    createEmployee
    );
    
    router.put('/:id',
    [
        validateJWT,
        check('firstName', 'The first name is require').not().isEmpty(),
        check('lastName', 'The last name is require').not().isEmpty(),
        check('document', 'The document is require').not().isEmpty(),
        check('typeDocument', 'The type document is require').not().isEmpty(),
        check('address', 'The address is require').not().isEmpty(),
        check('phone', 'The phone is require').not().isEmpty(),
        validateField
    ],
    updateEmployee
);

router.delete('/:id', 
    validateJWT,
    deleteEmployee
);


module.exports = router;