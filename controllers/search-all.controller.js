const { response } = require('express');
const Customer = require('../models/customer.model');
const User = require('../models/user.model');

const getSearchAll = async (req, res = response) => {

    const term = req.params.term;
    const regex = new RegExp(term, 'i');

    const [customers] = await Promise.all([
        Customer.find({ firstName: regex }),
    ])

    res.json({
        ok: true,
        customers
    });
}

const getDocumentColection = async (req, res = response) => {
    const collection = req.params.collectionName;
    const term = req.params.term;
    const regex = new RegExp(term, 'i');

    let data = [];

    switch (collection) {
        case 'customer':
            data = await Customer.find({ name: regex });
            break;
        case 'user':
            data = await User.find({ name: regex });
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
    getSearchAll,
    getDocumentColection
}