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
            .find({
                $or: [
                    { firstName: regex },
                    { lastName: regex },
                    { email: regex }
                ]
            }, 'firstName lastName email role google')
            .skip(page)
            .limit(count),

        User
            .find({
                $or: [
                    { firstName: regex },
                    { lastName: regex },
                    { email: regex }
                ]
            })
            .count()
    ]);

    res.json({
        ok: true,
        users,
        total
    });
}

const createUser = async (req, res = response) => {

    const { email, password } = req.body;

    try {
        const emailExists = await User.findOne({ email });

        if (emailExists) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya existe'
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
            msg: 'Error inesperado. Hable con el administrador'
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

        //Excluir el email, password y google de la data
        const { password, google, email, ...field } = req.body;

        if (userDB.email !== email) {

            const existEmail = await User.findOne({ email });

            if (existEmail) {
                return res.status(404).json({
                    ok: false,
                    msg: 'El correo ya existe'
                });
            }
        }

        if (!userDB.google) {
            field.email = email;
        } else if (userDB.email !== email) {
            res.status(400).json({
                ok: false,
                msg: 'Usuario de google no se permite actualizar correo'
            });
        }

        const userUpdate = await User.findByIdAndUpdate(userId, field, { new: true });

        res.json({
            ok: true,
            user: userUpdate
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado. Hable con el administrador'
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

        await User.findByIdAndDelete(userId);
        res.json({
            ok: true,
            msg: 'Usuario eliminado'
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado. Hable con el administrador'
        });
    }
}

module.exports = {
    getUsers,
    createUser,
    updateUser,
    deleteUser
}