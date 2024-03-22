const { response } = require('express');
const bcrypt = require('bcryptjs');

const User = require('../models/user.model');
const { generateJWT } = require('../helpers/jwt');
const Employee = require('../models/employee.model');

const getUsers = async (req, res) => {

    const page = Number(req.query.page) || 0;
    const count = Number(req.query.count) || 5;
    const term = req.query.term || '';
    const regex = new RegExp(term, 'i');
    const status = req.query.status || true;

    const [users, total] = await Promise.all([
        User
            .find({$or: [
                { firstName: regex },
                { lastName: regex }
            ],
            $and: [
                { status: status }
            ]})
            .skip(count * (page - 1))
            .limit(count)
            .sort({ 'firstName': 1 }),

        User
            .find({$or: [
                { firstName: regex },
                { lastName: regex }
            ],
            $and: [
                { status: status }
            ]})
            .count()
    ]);

    res.json({
        ok: true,
        users,
        total
    });
}

const createUser = async (req, res = response) => {

    const { userName, password } = req.body;

    try {
        const userNameExists = await User.findOne({ userName });

        if (userNameExists) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario ya existe'
            });
        }

        const {terms, employeeId, ...objUser } = req.body;
        const user = new User(objUser);
        
        const employee = await Employee.findById(employeeId);

        if (!employee) {
            return res.status(400).json({
                ok: false,
                msg: 'No se encontro el empleado'
            });
        }

        //Encriptar password
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(password, salt);

        const userNew = await user.save();

        const employeeUser = {...employee._doc, user: userNew._id}
        console.log('employeeUser: ', employeeUser);

        const empleoyeeUpdate = await Employee.findByIdAndUpdate(employee._id, employeeUser);

        if (!empleoyeeUpdate) {
            return res.status(400).json({
                ok: false,
                msg: 'No se pudo actualizar el empleado'
            });
        }

        //Generate Token - JWT
        //const token = await generateJWT(user.id);

        res.json({
            ok: true,
            user
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado. Contacte el administrador'
        });
    }
}

const updateUser = async (req, res = response) => {

    const userId = req.params.id

    try {

        const userDB = await User.findById(userId);

        if (!userDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Usuario no existe'
            });
        }        

        const userUpdate = await User.findByIdAndUpdate(userId, req.body);

        res.json({
            ok: true,
            user: userUpdate
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado. Contacte el administrador'
        });
    }
}

const deleteUser = async (req, res = response) => {

    const userId = req.params.id

    try {

        const userDB = await User.findById(userId);

        if (!userDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Usuario no existe'
            });
        }

        //Excluir el userName, password de la data
        const { password, userName, ...field } = req.body;

        await User.findByIdAndUpdate(userId, field);
        res.json({
            ok: true,
            msg: 'Estatus actualizado'
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado. Contacte el administrador'
        });
    }
}

module.exports = {
    getUsers,
    createUser,
    updateUser,
    deleteUser
}