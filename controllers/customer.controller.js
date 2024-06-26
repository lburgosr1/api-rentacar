const { response } = require('express');

const Customer = require('../models/customer.model');

const getCustomers = async (req, res) => {

    const page = Number(req.query.page) || 1;
    const count = Number(req.query.count) || 5;
    const term = req.query.term || '';
    const status = req.query.status || true;
    const regex = new RegExp(term, 'i');

    //Colleccion de promesa
    const [customers, total] = await Promise.all([
        Customer
            .find({
                $or: [
                    { firstName: regex },
                    { lastName: regex },
                    { phone: regex }
                ],
                $and: [
                    { status: status }
                ]
            })
            .skip(count * (page - 1))
            .limit(count)
            .sort({ 'firstName': 1 }),

        Customer
            .find({
                $or: [
                    { firstName: regex },
                    { lastName: regex },
                    { phone: regex }
                ],
                $and: [
                    { status: status }
                ]
            })
            .count()

    ]);


    res.json({
        ok: true,
        customers,
        total
    });
}

const getAllCustomers = async (req, res) => {

    //Colleccion de promesa
    const customers = await Customer
            .find({
                $and: [
                    { status: true }
                ]
            })
            .sort({ 'firstName': 1 });
            
    res.json({
        ok: true,
        customers
    });
}

const getCustomerById = async (req, res) => {

    const id = req.params.id;

    try {
        const customer = await Customer.findById(id);

        res.json({
            ok: true,
            customer
        })

    } catch (error) {
        console.log(error);
        res.json({
            ok: false,
            msg: 'Error inesperado. Contacte el administrador'
        });
    }
}

const createCustomer = async (req, res = response) => {

    let customer;

    customer = new Customer({
        ...req.body
    });

    const document = customer.document;

    try {

        const documentExists = await Customer.findOne({ document });

        if (documentExists) {
            return res.status(400).json({
                ok: false,
                msg: 'Ya existe una cedula registrada'
            });
        }

        const customerDB = await customer.save();

        res.json({
            ok: true,
            customer: customerDB
        });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado. Contacte el administrador'
        });
    }
}

const updateCustomer = async (req, res = response) => {

    const customerId = req.params.id;

    try {

        const customerDB = await Customer.findById(customerId);

        if (!customerDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Cliente no existe'
            });
        }

        await Customer.findByIdAndUpdate(customerId, req.body);
        const customerUpdate = await Customer.findById(customerId);

        res.json({
            ok: true,
            customer: customerUpdate
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado. Contacte el administrador'
        });
    }
}

const deleteCustomer = async (req, res = response) => {

    const customerId = req.params.id

    try {
        const customerDB = await Customer.findById(customerId);

        if (!customerDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Cliente no existe'
            });
        }

        const customer = req.body;

        await Customer.findByIdAndUpdate(customerId, customer);
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
    getCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    getCustomerById,
    getAllCustomers
}