/*
    Rute: /api/users
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validateField } = require('../middlewares/validate-field');

const { getUsers, createUser, updateUser, deleteUser } = require('../controllers/user.controller');
const { validateJWT, validateAdminRole, validateAdminRoleOrSameUser } = require('../middlewares/validate-jwt');

const router = Router();

router.get('/', validateJWT, getUsers);

router.post('/',
    [
        check('firstName', 'The first name is require').not().isEmpty(),
        check('lastName', 'The last name is require').not().isEmpty(),
        check('password', 'The password is require').not().isEmpty(),
        check('userName', 'The user name is require').not().isEmpty(),
        check('', 'The user name is require').not().isEmpty(),
        validateField
    ],
    createUser
);

router.put('/:id',
    [
        validateJWT,
        validateAdminRoleOrSameUser,
        check('firstName', 'The first name is require').not().isEmpty(),
        check('lastName', 'The last name is require').not().isEmpty(),
        check('userName', 'The userName is require').not().isEmpty(),
        validateField
    ],
    updateUser
);

router.delete('/:id', 
    [validateJWT, validateAdminRole],
    deleteUser
);


module.exports = router;