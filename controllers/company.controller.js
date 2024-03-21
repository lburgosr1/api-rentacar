const { response } = require('express');

const Company = require('../models/company.model');

const getCompanyById = async (req, res) => {

    const id = req.params.id;

    try {
        const company = await Company.findById(id);

        res.json({
            ok: true,
            company
        })

    } catch (error) {
        console.log(error);
        res.json({
            ok: false,
            msg: 'Error inesperado. Contacte el administrador'
        });
    }
}

const createCompany = async (req, res = response) => {
    
    const company =  new Company(req.body);

    try {

        await company.save();

        res.json({
            ok: true,
            company: company
        });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado. Contacte el administrador'
        });
    }
}

const updateCompany = async (req, res = response) => {

    const companyId = req.params.id;

    try {

        const companyDB = await Company.findById(companyId);

        if (!companyDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Company no existe'
            });
        }

        await Company.findByIdAndUpdate(companyId, req.body);
        const companyUpdate = await Company.findById(companyId);

        res.json({
            ok: true,
            company: companyUpdate
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado. Contacte el administrador'
        });
    }
}

const deleteCompany = async (req, res = response) => {

    const companyId = req.params.id
    
    try {
        const companyDB = await Company.findById(companyId);

        if (!companyDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Compañia no existe'
            });
        }

        const company = req.body;

        await Company.findByIdAndUpdate(companyId, company);
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
    createCompany,
    updateCompany,
    deleteCompany,
    getCompanyById
}