const { response } = require('express');

const RentACar = require('../models/rent-a-car.model');
const Vehicle = require('../models/vehicle.model');
const Invoice = require('../models/invoice.model');

const getRentACars = async (req, res) => {

    const page = Number(req.query.page) || 1;
    const count = Number(req.query.count) || 5;
    const term = req.query.term || '';
    const regex = new RegExp(term, 'i');
    let rentedCars = [];

    //Colleccion de promesa
    const [rentedCarsTem, total] = await Promise.all([
        RentACar
            .find()
            .populate({ path: 'customer', select: 'firstName lastName' })
            .populate({ path: 'document', select: 'typeDocument' })
            .populate({ path: 'coin', select: 'symbol coinName' })
            .populate({ path: 'vehicle', select: 'plate year' })
            .populate({ path: 'vehicle', populate: { path: 'brand', select: 'brandVehicle' } })
            .populate({ path: 'vehicle', populate: { path: 'model', select: 'vehicleModel' } })
            .populate({ path: 'vehicle', populate: { path: 'typeVehicle', select: 'typeVehicle' } })
            .skip(count * (page - 1))
            .limit(count)
            .sort({ 'rentalStartDate': 1 }),

        RentACar
            .find()
            .count()

    ]);

    if(rentedCarsTem && rentedCarsTem.length && term) {
        rentedCars = rentedCarsTem.filter((val) => 
               val.customer.firstName.toLowerCase().includes(term.toLowerCase()) ||
               val.customer.lastName.toLowerCase().includes(term.toLowerCase()) ||
               val.vehicle.brand.brandVehicle.toLowerCase().includes(term.toLowerCase()) ||
               val.vehicle.model.vehicleModel.toLowerCase().includes(term.toLowerCase()) ||
               val.vehicle.plate.toLowerCase().includes(term.toLowerCase())
         );
     } else {
        rentedCars = rentedCarsTem;
     }

    res.json({
        ok: true,
        rentedCars,
        total
    });

}

const getRentACarById = async (req, res) => {

    const id = req.params.id;

    try {
        const rentACar = await RentACar.findById(id);

        res.json({
            ok: true,
            rentACar
        })

    } catch (error) {
        console.log(error);
        res.json({
            ok: false,
            msg: 'Error inesperado. Contacte el administrador'
        });
    }
}

const createRentACar = async (req, res = response) => {

    const rentACar = new RentACar(req.body);

    try {
        const vehicleDB = await Vehicle.findById(rentACar.vehicle);

        if (!vehicleDB) {
            return res.status(404).json({
                ok: false,
                msg: 'El vehículo no existe'
            });
        }

        if (vehicleDB) {
            vehicleDB.status = 'rented';
            await Vehicle.findByIdAndUpdate(rentACar.vehicle, vehicleDB);
        }

       const newRentACar = await rentACar.save();

       const invoice = new Invoice({
        rentacar: newRentACar._id,
        invoiceCode: `RAC-${(Math.floor(Math.random()*90000) + 10000).toString()}`,
        invoiceDate: new Date()
       });

       await invoice.save();

        res.json({
            ok: true,
            rentACar: newRentACar
        });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado. Contacte el administrador'
        });
    }
}

const updateRentACar = async (req, res = response) => {

    const rentACarId = req.params.id;

    try {

        const rentACarDB = await RentACar.findById(rentACarId);

        if (!rentACarDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Registro no encontrado'
            });
        }

        const vehicleDB = await Vehicle.findById(rentACarDB.vehicle);

        if (!vehicleDB) {
            return res.status(404).json({
                ok: false,
                msg: 'El vehículo no existe'
            });
        }

        if (vehicleDB) {
            vehicleDB.status = 'active';
            await Vehicle.findByIdAndUpdate(rentACarDB.vehicle, vehicleDB);
        }

        await RentACar.findByIdAndUpdate(rentACarId, req.body);
        const rentACarUpdate = await RentACar.findById(rentACarId);

        res.json({
            ok: true,
            rentACar: rentACarUpdate
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado. Contacte el administrador'
        });
    }
}

const deleteRentACar = async (req, res = response) => {

    const rentACarId = req.params.id

    try {
        const rentACarDB = await RentACar.findById(rentACarId);

        if (!rentACarDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Empleado no existe'
            });
        }

        const rentACar = req.body;

        await RentACar.findByIdAndUpdate(rentACarId, rentACar);
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
    getRentACars,
    createRentACar,
    updateRentACar,
    deleteRentACar,
    getRentACarById
}