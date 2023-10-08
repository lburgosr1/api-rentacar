/*
    Path: '/api/login'
*/

const { Router } = require('express');
const { login, renewToken } = require('../controllers/auth.controller');
const { check } = require('express-validator');
const { validateField } = require('../middlewares/validate-field');
const { validateJWT } = require('../middlewares/validate-jwt');

const router = Router();


router.post('/', 
    [
        check('email', 'The email is require').isEmail(),
        check('password', 'The password is require').not().isEmpty(),
        validateField
    ],
    login
);

router.get('/renew', 
    validateJWT,
    renewToken
);



module.exports = router;
