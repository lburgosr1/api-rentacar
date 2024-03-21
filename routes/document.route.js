/*
    Rute: /api/document
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validateField } = require('../middlewares/validate-field');

const { validateJWT } = require('../middlewares/validate-jwt');
const { deleteDocument, updateDocument, createDocument, getDocumentById, getDocuments, getAllDocuments } = require('../controllers/document.controller');

const router = Router();

router.get('/', validateJWT, getDocuments);
router.get('/all-documents', validateJWT, getAllDocuments);
router.get('/:id', validateJWT, getDocumentById);

router.post('/',
    [
        validateJWT,
        check('typeDocument', 'The type document is require').not().isEmpty(),
        validateField
    ],
    createDocument
);

router.put('/:id',
    [
        validateJWT,
        check('typeDocument', 'The type document is require').not().isEmpty(),
        validateField
    ],
    updateDocument
);

router.delete('/:id',
    validateJWT,
    deleteDocument
);


module.exports = router;