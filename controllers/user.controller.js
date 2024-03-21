const { response } = require('express');
const bcrypt = require('bcryptjs');

const User = require('../models/user.model');
const { generateJWT } = require('../helpers/jwt');

const getUsers = async (req, res) => {

    const page = Number(req.query.page) || 0;
    const count = Number(req.query.count) || 5;
    const term = req.query.term || '';
    const regex = new RegExp(term, 'i');

    const [users, total] = await Promise.all([
        User
            .find()
            .skip(count * (page - 1))
            .limit(count),

        User
            .find()
            .count()
    ]);

    console.log('USERS: ', users)

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
        const user = new User(req.body);

        //Encriptar password
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(password, salt);

        await user.save();

        //Generate Token - JWT
        const token = await generateJWT(user.id);

        res.json({
            ok: true,
            user,
            token
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