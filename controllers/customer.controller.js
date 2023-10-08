const { response } = require('express');

const Customer = require('../models/customer.model');
const User = require('../models/user.model');


const getCustomers = async (req, res) => {

    console.log('REDUSERID: ', req.userId)
    const page = Number(req.query.page) || 1;
    const count = Number(req.query.count) || 5;
    const term = req.query.term || '';
    const regex = new RegExp(term, 'i');
    const userId = req.userId;

    const userDB = await User.findById(userId);

    if (userDB.role === 'AGENT_ROLE') {
        console.log('AGENT_ROLE')
        //Colleccion de promesa
        const [customers, total] = await Promise.all([
            Customer
                .find({
                    $and: [
                        { firstName: regex },
                        { lastName: regex },
                        { user: userId }
                    ]
                })
                .skip(count * (page - 1))
                .limit(count)
                .sort({ 'firstName': 1 }),

            Customer
                .find({
                    $and: [
                        { firstName: regex },
                        { lastName: regex },
                        { user: userId }
                    ]
                })
                .count()

        ]);


        res.json({
            ok: true,
            customers,
            total
        });

    } else {
        //Colleccion de promesa
        const [customers, total] = await Promise.all([
            Customer
                .find({
                    $or: [
                        { firstName: regex },
                        { lastName: regex }
                    ]
                })
                .skip(count * (page - 1))
                .limit(count)
                .sort({ 'firstName': 1 }),

                Customer
                .find({
                    $and: [
                        { firstName: regex },
                        { lastName: regex }
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

}

const getCustomerById = async (req, res) => {

    const id = req.params.id;

    try {
        const customer = await Customer.findById(id)
            .populate('user', 'name');
        res.json({
            ok: true,
            customer
        })

    } catch (error) {
        console.log(error);
        res.json({
            ok: false,
            msg: 'Unexpected error check the log'
        });
    }
}

const createCustomer = async (req, res = response) => {

    const userId = req.userId;
    let customer;


    if (req.body.user) {
        customer = new Customer({
            ...req.body
        });
    } else {
        customer = new Customer({
            user: userId,
            ...req.body
        });
    }

    const document = customer.document;

    try {

        const documentExists = await Customer.findOne({ document });

        if (documentExists) {
            return res.status(400).json({
                ok: false,
                msg: 'Ya existe una cedula registrada con este u otro cliente'
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
            msg: 'Unexpected error check the log'
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
                msg: 'Customer does not exist'
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
            msg: 'Unexpected error check the log'
        });
    }
}

const deleteCustomer = async (req, res = response) => {

    try {


        res.json({
            ok: true,
            msg: 'Customer delete'
        });

    } catch {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Unexpected error check the log'
        });
    }
}

module.exports = {
    getCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    getCustomerById
}