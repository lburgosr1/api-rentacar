/*
    Rute: /api/coin
*/
const { Router } = require('express');
const { validateJWT } = require('../middlewares/validate-jwt');
const { generateInvoice, getInvoice } = require('../controllers/invoice.controller');

const router = Router();

router.post('/', validateJWT, generateInvoice);
router.get('/:id', validateJWT, getInvoice);

module.exports = router;