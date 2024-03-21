const { response } = require('express');

const TypeVehicle = require('../models/type-vehicle.model');

const getTypeVehicles = async (req, res) => {

    const page = Number(req.query.page) || 1;
    const count = Number(req.query.count) || 5;
    const term = req.query.term || '';
    const regex = new RegExp(term, 'i');
    const status = req.query.status || true;

    //Colleccion de promesa
    const [typeVehicles, total] = await Promise.all([
        TypeVehicle
            .find({
                $or: [
                    { typeVehicle: regex },
                ],
                $and: [
                    { status: status }
                ]
            })
            .skip(count * (page - 1))
            .limit(count)
            .sort({ 'typeVehicle': 1 }),

        TypeVehicle
            .find({
                $or: [
                    { typeVehicle: regex }
                ],
                $and: [
                    { status: status }
                ]
            })
            .count()

    ]);


    res.json({
        ok: true,
        typeVehicles,
        total
    });

}

const getTypeVehicleById = async (req, res) => {

    const id = req.params.id;

    try {
        const typeVehicle = await TypeVehicle.findById(id);

        res.json({
            ok: true,
            typeVehicle
        })

    } catch (error) {
        console.log(error);
        res.json({
            ok: false,
            msg: 'Error inesperado. Contacte el administrador'
        });
    }
}

const createTypeVehicle = async (req, res = response) => {
    
    let type;


    type = new TypeVehicle({
        ...req.body
    });
    
    const typeVehicle = type.typeVehicle;

    try {

        const typeVehicleExists = await TypeVehicle.findOne({ typeVehicle });

        if (typeVehicleExists) {
            return res.status(400).json({
                ok: false,
                msg: 'Ya existe una tipo similar registrado'
            });
        }

        const typeVehicleDB = await type.save();

        res.json({
            ok: true,
            typeVehicle: typeVehicleDB
        });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado. Contacte el administrador'
        });
    }
}

const updateTypeVehicle = async (req, res = response) => {

    const typeVehicleId = req.params.id;

    try {

        const typeVehicleDB = await TypeVehicle.findById(typeVehicleId);

        if (!typeVehicleDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Tipo no existe'
            });
        }

        await TypeVehicle.findByIdAndUpdate(typeVehicleId, req.body);
        const typeVehicleUpdate = await TypeVehicle.findById(typeVehicleId);

        res.json({
            ok: true,
            typeVehicle: typeVehicleUpdate
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado. Contacte el administrador'
        });
    }
}

const deleteTypeVehicle = async (req, res = response) => {

    const typeVehicleId = req.params.id
    
    try {
        const typeVehicleDB = await TypeVehicle.findById(typeVehicleId);

        if (!typeVehicleDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Tipo no existe'
            });
        }

        const typeVehicle = req.body;

        await TypeVehicle.findByIdAndUpdate(typeVehicleId, typeVehicle);
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
    getTypeVehicles,
    createTypeVehicle,
    updateTypeVehicle,
    deleteTypeVehicle,
    getTypeVehicleById
}