const { response } = require('express');

const Vehicle = require('../models/vehicle.model');

const getVehicles = async (req, res) => {

    const page = Number(req.query.page) || 1;
    const count = Number(req.query.count) || 5;
    const term = req.query.term || '';
    const regex = new RegExp(term, 'i');
    const status = req.query.status || 'active';
    let vehicles;

    //Colleccion de promesa
    const [vehiclesTemp, total] = await Promise.all([
        Vehicle
            .find({
                $and: [
                    { status: status }
                ]
            })
            .populate({ path: 'brand', select: 'brandVehicle' })
            .populate({ path: 'model', select: 'vehicleModel' })
            .populate({ path: 'typeVehicle', select: 'typeVehicle' })
            .skip(count * (page - 1))
            .limit(count)
            .sort({ 'plate': 1 }),

        Vehicle
            .find({
                $and: [
                    { status: status }
                ]
            })
            .count()

    ]);

    if (vehiclesTemp && vehiclesTemp.length) {
        vehicles = vehiclesTemp.filter((val) =>
            val.brand.brandVehicle.toLowerCase().includes(term.toLowerCase()) ||
            val.model.vehicleModel.toLowerCase().includes(term.toLowerCase()) ||
            val.typeVehicle.typeVehicle.toLowerCase().includes(term.toLowerCase()) ||
            val.plate.toLowerCase().includes(term.toLowerCase())
        );
    } else {
        vehicles = vehiclesTemp;
    }


    res.json({
        ok: true,
        vehicles,
        total
    });

}

const getVehicleById = async (req, res) => {

    const id = req.params.id;

    try {
        const vehicle = await Vehicle.findById(id);

        res.json({
            ok: true,
            vehicle
        })

    } catch (error) {
        console.log(error);
        res.json({
            ok: false,
            msg: 'Error inesperado. Contacte el administrador'
        });
    }
}

const createVehicle = async (req, res = response) => {

    let vehicle;


    vehicle = new Vehicle({
        ...req.body
    });

    const plate = vehicle.plate;

    try {

        const vehicleExists = await Vehicle.findOne({ plate });

        if (vehicleExists) {
            return res.status(400).json({
                ok: false,
                msg: 'Ya existe una marca similar registrada'
            });
        }

        const vehicleDB = await vehicle.save();

        res.json({
            ok: true,
            vehicle: vehicleDB
        });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado. Contacte el administrador'
        });
    }
}

const updateVehicle = async (req, res = response) => {

    const vehicleId = req.params.id;

    try {

        const vehicleDB = await Vehicle.findById(vehicleId);

        if (!vehicleDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Vehículo no existe'
            });
        }

        await Vehicle.findByIdAndUpdate(vehicleId, req.body);
        const vehicleUpdate = await Vehicle.findById(vehicleId);

        res.json({
            ok: true,
            vehicle: vehicleUpdate
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado. Contacte el administrador'
        });
    }
}

const deleteVehicle = async (req, res = response) => {

    const vehicleId = req.params.id

    try {
        const vehicleDB = await Vehicle.findById(vehicleId);

        if (!vehicleDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Tipo no existe'
            });
        }

        const vehicle = req.body;

        await Vehicle.findByIdAndUpdate(vehicleId, vehicle);
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
    getVehicles,
    createVehicle,
    updateVehicle,
    deleteVehicle,
    getVehicleById
}