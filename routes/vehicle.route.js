/*
    Rute: /api/vehicle
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validateField } = require('../middlewares/validate-field');

const { validateJWT } = require('../middlewares/validate-jwt');
const { deleteVehicle, updateVehicle, createVehicle, getVehicleById, getVehicles, getAllVehicles } = require('../controllers/vehicle.controller');

const router = Router();

router.get('/', validateJWT, getVehicles);
router.get('/:id', validateJWT, getVehicleById);

router.post('/',
    [
        validateJWT,
        check('brand', 'The brand is require').not().isEmpty(),
        check('model', 'The model is require').not().isEmpty(),
        check('typeVehicle', 'The type vehicle is require').not().isEmpty(),
        check('plate', 'The plate is require').not().isEmpty(),
        check('year', 'The year is require').not().isEmpty(),
        validateField
    ],
    createVehicle
);

router.put('/:id',
    [
        validateJWT,
        check('brand', 'The first name is require').not().isEmpty(),
        check('model', 'The model is require').not().isEmpty(),
        check('typeVehicle', 'The last name is require').not().isEmpty(),
        check('plate', 'The plate is require').not().isEmpty(),
        check('year', 'The year is require').not().isEmpty(),
        validateField
    ],
    updateVehicle
);

router.delete('/:id',
    validateJWT,
    deleteVehicle
);


module.exports = router;