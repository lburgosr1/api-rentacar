/*
    Rute: /api/brand-vehicle
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validateField } = require('../middlewares/validate-field');

const { validateJWT } = require('../middlewares/validate-jwt');

const { getBrandVehicles, getBrandVehicleById, createBrandVehicle, updateBrandVehicle, deleteBrandVehicle } = require('../controllers/brand-vehicle.controller');

const router = Router()

router.get('/', validateJWT, getBrandVehicles);
router.get('/:id', validateJWT, getBrandVehicleById);

router.post('/',
    [
        validateJWT,
        check('brandVehicle', 'The brand vehicle is require').not().isEmpty(),
        validateField
    ],
    createBrandVehicle
);

router.put('/:id',
    [
        validateJWT,
        check('brandVehicle', 'The brand vehicle is require').not().isEmpty(),
        validateField
    ],
    updateBrandVehicle
);

router.delete('/:id', 
    validateJWT,
    deleteBrandVehicle
);


module.exports = router;