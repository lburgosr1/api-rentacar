const fs = require('fs');

const Customer = require('../models/customer.model');
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
        case 'customers':
            const customer = await Customer.findById(id);
            if(!customer) {
                console.log('No se encontro el cliente');
                return false
            }

            pathOld = `./upload/customers/${ customer.file}`;
            deleteFile(pathOld);

            customer.file = fileName;
            await customer.save();
            return true;

        break;
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
        break;
    }

}


module.exports = {
    updateFile
}