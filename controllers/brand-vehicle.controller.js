const { response } = require('express');

const BrandVehicle = require('../models/brand-vehicle.model');

const getBrandVehicles = async (req, res) => {

    const page = Number(req.query.page) || 1;
    const count = Number(req.query.count) || 5;
    const term = req.query.term || '';
    const regex = new RegExp(term, 'i');
    const status = req.query.status || true;
    
    //Colleccion de promesa
    const [brandVehicles, total] = await Promise.all([
        BrandVehicle
            .find({
                $or: [
                    { brandVehicle: regex },
                ],
                $and: [
                    { status: status }
                ]
            })
            .skip(count * (page - 1))
            .limit(count)
            .sort({ 'brandVehicle': 1 }),

        BrandVehicle
            .find({
                $or: [
                    { brandVehicle: regex }
                ],
                $and: [
                    { status: status }
                ]
            })
            .count()

    ]);


    res.json({
        ok: true,
        brandVehicles,
        total
    });

}

const getBrandVehicleById = async (req, res) => {

    const id = req.params.id;

    try {
        const brandVehicle = await brandVehicle.findById(id);

        res.json({
            ok: true,
            brandVehicle
        })

    } catch (error) {
        console.log(error);
        res.json({
            ok: false,
            msg: 'Error inesperado. Contacte el administrador'
        });
    }
}

const createBrandVehicle = async (req, res = response) => {
    
    let brand;


    brand = new BrandVehicle({
        ...req.body
    });
    
    const brandVehicle = brand.brandVehicle;

    try {

        const brandVehicleExists = await BrandVehicle.findOne({ brandVehicle });

        if (brandVehicleExists) {
            return res.status(400).json({
                ok: false,
                msg: 'Ya existe una marca con ese nombre registrada'
            });
        }

        const brandVehicleDB = await brand.save();

        res.json({
            ok: true,
            brandVehicle: brandVehicleDB
        });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado. Contacte el administrador'
        });
    }
}

const updateBrandVehicle = async (req, res = response) => {

    const brandVehicleId = req.params.id;

    try {

        const brandVehicleDB = await BrandVehicle.findById(brandVehicleId);

        if (!brandVehicleDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Marca no existe'
            });
        }

        await BrandVehicle.findByIdAndUpdate(brandVehicleId, req.body);
        const brandVehicleUpdate = await BrandVehicle.findById(brandVehicleId);

        res.json({
            ok: true,
            brandVehicle: brandVehicleUpdate
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado. Contacte el administrador'
        });
    }
}

const deleteBrandVehicle = async (req, res = response) => {

    const brandVehicleId = req.params.id
    
    try {
        const brandVehicleDB = await BrandVehicle.findById(brandVehicleId);

        if (!brandVehicleDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Marca no existe'
            });
        }

        const brandVehicle = req.body;

        await BrandVehicle.findByIdAndUpdate(brandVehicleId, brandVehicle);
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
    getBrandVehicles,
    createBrandVehicle,
    updateBrandVehicle,
    deleteBrandVehicle,
    getBrandVehicleById
}