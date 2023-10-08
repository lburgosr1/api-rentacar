const jwt = require("jsonwebtoken");
const User = require('../models/user.model');



const validateJWT = (req, res, next) => {

    //Leer el token
    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            ok: false,
            msg: 'There is no token in the request'
        });
    }

    try {

        const { userId } = jwt.verify(token, process.env.JWT_SECRET);

        req.userId = userId;

        next();

    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token no valid'
        });
    }
}

const validateAdminRole = async (req, res, next) => {

    const userId = req.userId;

    try {
        const userDB = await User.findById(userId);

        if (!userDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Usuario no existe'
            });
        }

        if (userDB.role !== 'ADMIN_ROLE') {
            return res.status(403).json({
                ok: false,
                msg: 'No tiene los permisos necesarios para esta acción'
            });
        }

        next();

    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
}

const validateAdminRoleOrSameUser = async (req, res, next) => {

    const userId = req.userId;
    const idParam = req.params.id;

    try {
        const userDB = await User.findById(userId);

        if (!userDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Usuario no existe'
            });
        }

        if (userDB.role === 'ADMIN_ROLE' || userId === idParam) {
            next();
        } else {
            return res.status(403).json({
                ok: false,
                msg: 'No tiene los permisos necesarios para esta acción'
            });
        }


    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
}


module.exports = {
    validateJWT,
    validateAdminRole,
    validateAdminRoleOrSameUser
}