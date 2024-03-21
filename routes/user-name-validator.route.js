/*
    Rute: /api/
*/
const { Router } = require('express');
const { validateJWT } = require('../middlewares/validate-jwt');
const { getUserNameValidator } = require('../controllers/validator.controller');

const router = Router();

router.get('/',
getUserNameValidator
);

module.exports = router;