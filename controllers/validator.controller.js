const { response } = require('express');

const Customer = require('../models/customer.model');
const User = require('../models/user.model');

const getUserNameValidator = async (req, res = response) => {
    const userName = req.query.userName;

    try {
        const userNameFound = await User.find({ userName: userName });

        if(!Object.keys(userNameFound).length) {
            return res.json({
                ok: false,
                msg: ''
            });
        }

        return res.json({
            ok: true,
            msg: 'El nombre de usuario ya existe' 
        });

    } catch (error) {
        console.log(error);
        res.json({
            ok: false,
            msg: 'Unexpected error check the log'
        });
    }
}

const getDocumentValidator = async (req, res = response) => {
    const document = req.query.document;

    try {
        const customer = await Customer.findOne({ document });

        if(!Object.keys(customer).length) {
            return res.json({
                ok: false,
                msg: ''
            });
        }

        return res.json({
            ok: true,
            msg: 'El documento ingresado ya existe' 
        });

    } catch (error) {
        console.log(error);
        res.json({
            ok: false,
            msg: 'Unexpected error check the log'
        });
    }
}

module.exports = {
    getUserNameValidator,
    getDocumentValidator
}