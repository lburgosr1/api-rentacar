/*
    Rute: /api/rent-a-car
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validateField } = require('../middlewares/validate-field');

const { validateJWT } = require('../middlewares/validate-jwt');
const { deleteRentACar, updateRentACar, createRentACar, getRentACarById, getRentACars } = require('../controllers/rent-a-car.controller');

const router = Router();

router.get('/', validateJWT, getRentACars);
router.get('/:id', validateJWT, getRentACarById);

router.post('/',
    [
        validateJWT,
        check('customer', 'The customer is require').not().isEmpty(),
        check('vehicle', 'The vehicle is require').not().isEmpty(),
        check('document', 'The document is require').not().isEmpty(),
        check('rentalStartDate', 'The rental start date is require').not().isEmpty(),
        check('rentalEndDate', 'The rental end date is require').not().isEmpty(),
        check('daysOfRent', 'The days of rent is require').not().isEmpty(),
        validateField
    ],
    createRentACar
    );
    
    router.put('/:id',
    [
        validateJWT,
        check('customer', 'The customer is require').not().isEmpty(),
        check('vehicle', 'The vehicle is require').not().isEmpty(),
        check('document', 'The document is require').not().isEmpty(),
        check('rentalStartDate', 'The rental start date is require').not().isEmpty(),
        check('rentalEndDate', 'The rental end date is require').not().isEmpty(),
        check('daysOfRent', 'The days of rent is require').not().isEmpty(),
        validateField
    ],
    updateRentACar
);

router.delete('/:id', 
    validateJWT,
    deleteRentACar
);


module.exports = router;