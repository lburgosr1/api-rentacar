const { response } = require('express');
const bcrypt = require('bcryptjs');

const User = require('../models/user.model');
const { generateJWT } = require('../helpers/jwt');
const { getMenuFrontEnd } = require('../helpers/menu-frontend');


const login = async(req, res = response) => {

    //Verify email
    const { email, password } = req.body;

    try {

        const userDB = await User.findOne({ email });

        if(!userDB) {
            return res.status(404).json({
                ok: false,
                msg: 'The email no found'
            });
        }

        //Verify password
        const verifyPassword = bcrypt.compareSync(password, userDB.password);

        if(!verifyPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'The password no valid'
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