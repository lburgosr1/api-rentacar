const { response } = require('express');

const Document = require('../models/document.model');

const getDocuments = async (req, res) => {

    const page = Number(req.query.page) || 1;
    const count = Number(req.query.count) || 5;
    const term = req.query.term || '';
    const regex = new RegExp(term, 'i');
    const status = req.query.status || true;

    console.log("STATUS: ",status)
    //Colleccion de promesa
    const [documents, total] = await Promise.all([
        Document
            .find({
                $or: [
                    { typeDocument: regex },
                ],
                $and: [
                    { status: status }
                ]
            })
            .skip(count * (page - 1))
            .limit(count)
            .sort({ 'typeDocument': 1 }),

        Document
            .find({
                $or: [
                    { typeDocument: regex }
                ],
                $and: [
                    { status: status }
                ]
            })
            .count()

    ]);


    res.json({
        ok: true,
        documents,
        total
    });

}

const getAllDocuments = async (req, res) => {
    //Colleccion de promesa
    const documents = await Document
            .find({
                $and: [
                    { status: true }
                ]
            })
            .sort({ 'typeDocument': 1 })


    res.json({
        ok: true,
        documents
    });

}

const getDocumentById = async (req, res) => {

    const id = req.params.id;

    try {
        const document = await Document.findById(id);

        res.json({
            ok: true,
            document
        })

    } catch (error) {
        console.log(error);
        res.json({
            ok: false,
            msg: 'Error inesperado. Contacte el administrador'
        });
    }
}

const createDocument = async (req, res = response) => {
    
    const document =  new Document(req.body);

    try {

        await document.save();

        res.json({
            ok: true,
            document: document
        });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado. Contacte el administrador'
        });
    }
}

const updateDocument = async (req, res = response) => {

    const documentId = req.params.id;

    try {

        const documentDB = await Document.findById(documentId);

        if (!documentDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Document no existe'
            });
        }

        await Document.findByIdAndUpdate(documentId, req.body);
        const documentUpdate = await Document.findById(documentId);

        res.json({
            ok: true,
            document: documentUpdate
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado. Contacte el administrador'
        });
    }
}

const deleteDocument = async (req, res = response) => {

    const documentId = req.params.id
    
    try {
        const documentDB = await Document.findById(documentId);

        if (!documentDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Moneda no existe'
            });
        }

        const document = req.body;

        await Document.findByIdAndUpdate(documentId, document);
        res.json({
            ok: true,
            msg: 'Estatus actualizado'
        });

    } catch {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado. Contacte el administrador'
        });
    }
}

module.exports = {
    getDocuments,
    createDocument,
    updateDocument,
    deleteDocument,
    getDocumentById,
    getAllDocuments
}