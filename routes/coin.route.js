/*
    Rute: /api/coin
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validateField } = require('../middlewares/validate-field');

const { validateJWT } = require('../middlewares/validate-jwt');
const { deleteCoin, updateCoin, createCoin, getCoinById, getCoins, getAllCoins } = require('../controllers/coin.controller');

const router = Router();

router.get('/', validateJWT, getCoins);
router.get('/all-coins', validateJWT, getAllCoins);
router.get('/:id', validateJWT, getCoinById);

router.post('/',
    [
        validateJWT,
        check('coinName', 'The coin name is require').not().isEmpty(),
        check('symbol', 'The symbol is require').not().isEmpty(),
        validateField
    ],
    createCoin
);

router.put('/:id',
    [
        validateJWT,
        check('coinName', 'The coin name is require').not().isEmpty(),
        check('symbol', 'The symbol is require').not().isEmpty(),
        validateField
    ],
    updateCoin
);

router.delete('/:id',
    validateJWT,
    deleteCoin
);


module.exports = router;