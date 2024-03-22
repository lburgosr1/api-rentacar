const { response } = require('express');
const Customer = require('../models/customer.model');
const Vehicle = require('../models/vehicle.model');
const Employee = require('../models/employee.model');

const getDocumentColection = async (req, res = response) => {
    const collection = req.params.collectionName;
    const term = req.params.term;
    const regex = new RegExp(term, 'i');

    let data = [];

    switch (collection) {
        case 'customer':
            data = await Customer.find({
                $or: [
                    { firstName: regex },
                    { lastName: regex },
                    { document: regex }
                ],
                $and: [
                    { status: true }
                ]
            });
            break;
        case 'employee':
            data = await Employee.find({
                $or: [
                    { firstName: regex },
                    { lastName: regex },
                    { document: regex }
                ],
                $and: [
                    { status: true }
                ]
            });
            break;
        case 'vehicle':
            dataTemp = await Vehicle.find()
                .populate({ path: 'brand', select: 'brandVehicle' })
                .populate({ path: 'model', select: 'vehicleModel' })
                .populate({ path: 'typeVehicle', select: 'typeVehicle' })

            if (dataTemp && dataTemp.length) {
                data = dataTemp.filter((val) =>
                    (val.brand.brandVehicle.toLowerCase().includes(term.toLowerCase()) ||
                        val.model.vehicleModel.toLowerCase().includes(term.toLowerCase()) ||
                        val.plate.toLowerCase().includes(term.toLowerCase())) &&
                    val.status === 'active'
                );
            } else {
                data = dataTemp;
            }
            break;
        default:
            return res.status(400).json({
                ok: false,
                msg: 'No se encontro la tabla especificada'
            });
    }

    res.status(200).json({
        ok: true,
        result: data
    });
}

module.exports = {
    getDocumentColection
}