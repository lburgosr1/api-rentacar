/*
    Rute: /api/searhAll
*/
const { Router } = require('express');

const { validateJWT } = require('../middlewares/validate-jwt');
const { getDocumentColection } = require('../controllers/search-all.controller');

const router = Router();

router.get('/collection/:collectionName/:term', validateJWT, getDocumentColection);

module.exports = router;