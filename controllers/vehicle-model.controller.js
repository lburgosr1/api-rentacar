const { response } = require('express');

const VehicleModel = require('../models/vehicle-model.model');

const getVehicleModels = async (req, res) => {

    const page = Number(req.query.page) || 1;
    const count = Number(req.query.count) || 5;
    const term = req.query.term || '';
    const regex = new RegExp(term, 'i');
    const status = req.query.status || true;
    
    //Colleccion de promesa
    const [vehicleModels, total] = await Promise.all([
        VehicleModel
            .find({
                $or: [
                    { vehicleModel: regex },
                ],
                $and: [
                    { status: status }
                ]
            })
            .populate({path: 'brand', select: 'brandVehicle'})
            .skip(count * (page - 1))
            .limit(count)
            .sort({ 'vehicleModel': 1 }),

        VehicleModel
            .find({
                $or: [
                    { vehicleModel: regex }
                ],
                $and: [
                    { status: status }
                ]
            })
            .count()

    ]);


    res.json({
        ok: true,
        vehicleModels,
        total
    });

}

const getVehicleModelById = async (req, res) => {

    const id = req.params.id;

    try {
        const vehicleModel = await VehicleModel.findById(id);

        res.json({
            ok: true,
            vehicleModel
        })

    } catch (error) {
        console.log(error);
        res.json({
            ok: false,
            msg: 'Error inesperado. Contacte el administrador'
        });
    }
}

const getVehicleModelsByBrand = async (req, res) => {

    const brandId = req.params.brandId;

    try {
        const models = await VehicleModel.find({
            $and: [
            { brand: brandId },
            { status: true }
        ]});

        res.json({
            ok: true,
            models
        })

    } catch (error) {
        console.log(error);
        res.json({
            ok: false,
            msg: 'Error inesperado. Contacte el administrador'
        });
    }
}

const createVehicleModel = async (req, res = response) => {
    
    let model;


    model = new VehicleModel({
        ...req.body
    });
    
    const vehicleModel = model.vehicleModel;

    try {

        const vehicleModelExists = await VehicleModel.findOne({ vehicleModel });

        if (vehicleModelExists) {
            return res.status(400).json({
                ok: false,
                msg: 'Ya existe un modelo con ese nombre registrado'
            });
        }

        const vehicleModelDB = await model.save();

        res.json({
            ok: true,
            vehicleModel: vehicleModelDB
        });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado. Contacte el administrador'
        });
    }
}

const updateVehicleModel = async (req, res = response) => {

    const vehicleModelId = req.params.id;

    try {

        const vehicleModelDB = await VehicleModel.findById(vehicleModelId);

        if (!vehicleModelDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Modelo no existe'
            });
        }

        await VehicleModel.findByIdAndUpdate(vehicleModelId, req.body);
        const vehicleModelUpdate = await VehicleModel.findById(vehicleModelId);

        res.json({
            ok: true,
            vehicleModel: vehicleModelUpdate
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado. Contacte el administrador'
        });
    }
}

const deleteVehicleModel = async (req, res = response) => {

    const vehicleModelId = req.params.id
    
    try {
        const vehicleModelDB = await VehicleModel.findById(vehicleModelId);

        if (!vehicleModelDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Modelo no existe'
            });
        }

        const vehicleModel = req.body;

        await VehicleModel.findByIdAndUpdate(vehicleModelId, vehicleModel);
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
    getVehicleModels,
    createVehicleModel,
    updateVehicleModel,
    deleteVehicleModel,
    getVehicleModelById,
    getVehicleModelsByBrand
}