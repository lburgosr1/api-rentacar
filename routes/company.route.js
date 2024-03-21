/*
    Rute: /api/company
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validateField } = require('../middlewares/validate-field');

const { validateJWT } = require('../middlewares/validate-jwt');
const { deleteCompany, updateCompany, createCompany, getCompanyById, getCompanys } = require('../controllers/company.controller');

const router = Router();

router.get('/:id', validateJWT, getCompanyById);

router.post('/',
    [
        validateJWT,
        check('companyName', 'The company name is require').not().isEmpty(),
        check('rnc', 'The rnc is require').not().isEmpty(),
        check('address', 'The address is require').not().isEmpty(),
        check('phone', 'The phone is require').not().isEmpty(),
        validateField
    ],
    createCompany
    );
    
    router.put('/:id',
    [
        validateJWT,
        check('companyName', 'The company name is require').not().isEmpty(),
        check('rnc', 'The rnc is require').not().isEmpty(),
        check('address', 'The address is require').not().isEmpty(),
        check('phone', 'The phone is require').not().isEmpty(),
        validateField
    ],
    updateCompany
);

router.delete('/:id', 
    validateJWT,
    deleteCompany
);


module.exports = router;