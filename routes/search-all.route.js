/*
    Rute: /api/searhAll
*/
const { Router } = require('express');

const { getSearchAll, getDocumentColection } = require('../controllers/search-all.controller');
const { validateJWT } = require('../middlewares/validate-jwt');

const router = Router();

router.get('/:term', validateJWT, getSearchAll);
router.get('/collection/:collectionName/:term', validateJWT, getDocumentColection);

module.exports = router;