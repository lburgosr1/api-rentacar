const fs = require('fs');

const Vehicle = require('../models/vehicle.model');
const UserModel = require('../models/user.model');

const deleteFile = (path) => {

    if(fs.existsSync(path)) {
        //Borrar imagen existente
        fs.unlinkSync(path);
    }

}

const updateFile = async (type, id, fileName) => {

    let pathOld = '';

    switch(type) {
        case 'vehicles':
            const vehicle = await Vehicle.findById(id);
            if(!vehicle) {
                console.log('No se encontro el vehiculo');
                return false
            }

            pathOld = `./upload/vehicles/${ vehicle.image}`;
            deleteFile(pathOld);

            vehicle.image = fileName;
            await vehicle.save();
            return true;
            
        case 'users':
            const user = await UserModel.findById(id);
            if(!user) {
                console.log('No se encontro el usuario');
                return false
            }

            pathOld = `./upload/users/${ user.image}`;
            deleteFile(pathOld);

            user.image = fileName;
            await user.save();
            return true;
    }

}


module.exports = {
    updateFile
}