const { response } = require('express');
const bcrypt = require('bcryptjs');

const User = require('../models/user.model');
const { generateJWT } = require('../helpers/jwt');
const { getMenuFrontEnd } = require('../helpers/menu-frontend');


const login = async(req, res = response) => {

    //Verify userName
    const { userName, password } = req.body;

    try {

        const userDB = await User.findOne({ userName });

        if(!userDB) {
            return res.status(404).json({
                ok: false,
                msg: 'El nombre de usuario no existe'
            });
        } else if(!userDB.status) {
            return res.status(404).json({
                ok: false,
                msg: 'El usuario no esta activo'
            });
        }

        //Verify password
        const verifyPassword = bcrypt.compareSync(password, userDB.password);

        if(!verifyPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'La contraseña no es valida'
            });
        }

        //Generate Token - JWT
        const token = await generateJWT(userDB.id);
        const { firstName, lastName } = userDB;
        
        

        res.json({
            ok: true,
            firstName, lastName,
            token,
            menu: getMenuFrontEnd(userDB.role)
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Unexpected error check the log'
        })
    }
}

const renewToken = async (req, res = response) => {

    const userId = req.userId;
    const userDB = await User.findById(userId);
    //Generate Token - JWT
    const token = await generateJWT(userId);

    res.json({
        ok: true,
        user: userDB,
        token,
        menu: getMenuFrontEnd(userDB.role)
    })
}

module.exports = {
    login,
    renewToken
};