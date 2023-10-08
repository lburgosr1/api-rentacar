/*
    Rute: /api/upload
*/
const { Router } = require('express');
const expressFileUpload = require('express-fileupload');

const { fileUpload, getFile } = require('../controllers/upload.cotroller');
const { validateJWT } = require('../middlewares/validate-jwt');

const router = Router();

router.use(expressFileUpload());

router.put('/:type/:id', validateJWT, fileUpload);

router.get('/:type/:file', getFile);

module.exports = router;