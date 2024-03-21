/*
    Rute: /api/type-vehicle
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validateField } = require('../middlewares/validate-field');

const { validateJWT } = require('../middlewares/validate-jwt');

const { getTypeVehicles, getTypeVehicleById, createTypeVehicle, updateTypeVehicle, deleteTypeVehicle } = require('../controllers/type-vehicle.controller');

const router = Router()

router.get('/', validateJWT, getTypeVehicles);
router.get('/:id', validateJWT, getTypeVehicleById);

router.post('/',
    [
        validateJWT,
        check('typeVehicle', 'The type vehicle is require').not().isEmpty(),
        validateField
    ],
    createTypeVehicle
);

router.put('/:id',
    [
        validateJWT,
        check('typeVehicle', 'The type vehicle is require').not().isEmpty(),
        validateField
    ],
    updateTypeVehicle
);

router.delete('/:id', 
    validateJWT,
    deleteTypeVehicle
);


module.exports = router;