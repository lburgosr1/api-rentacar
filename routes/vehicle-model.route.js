/*
    Rute: /api/vehicle-model
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validateField } = require('../middlewares/validate-field');

const { validateJWT } = require('../middlewares/validate-jwt');

const { getVehicleModels, getVehicleModelById, createVehicleModel, updateVehicleModel, deleteVehicleModel, getVehicleModelsByBrand } = require('../controllers/vehicle-model.controller');

const router = Router()

router.get('/', validateJWT, getVehicleModels);
router.get('/:id', validateJWT, getVehicleModelById);
router.get('/brands/:brandId', validateJWT, getVehicleModelsByBrand);

router.post('/',
    [
        validateJWT,
        check('vehicleModel', 'The vehicle model is require').not().isEmpty(),
        check('brand', 'The brand vehicle is require').not().isEmpty(),
        validateField
    ],
    createVehicleModel
);

router.put('/:id',
    [
        validateJWT,
        check('vehicleModel', 'The vehicle model is require').not().isEmpty(),
        check('brand', 'The brand vehicle is require').not().isEmpty(),
        validateField
    ],
    updateVehicleModel
);

router.delete('/:id', 
    validateJWT,
    deleteVehicleModel
);


module.exports = router;