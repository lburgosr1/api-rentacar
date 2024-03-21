const path = require('path');
const fs = require('fs');

const { response } = require('express');
const { v4: uuidv4 } = require('uuid');
const { updateFile } = require('../helpers/updateFile');

const fileUpload = (req, res = response) => {

    const type = req.params.type;
    const id = req.params.id;

    const typeValid = ['vehicles', 'users'];

    if (!typeValid.includes(type)) {
        return res.status(400).json({
            ok: false,
            msg: 'No es un tipo valido'
        });
    }

    //Validar que existe alchivo
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            msg: 'No files were uploaded.'
        });
    }

    //Procesar el archivo
    const file = req.files.file;

    
    const splitName = file.name.split('.');
    const typeFile = splitName[splitName.length - 1];
    
    //Validar tipo de archivo
    const validFileTypes = ['png','jpg','jpeg','gif','pdf'];

    if (!validFileTypes.includes(typeFile)) {
        return res.status(400).json({
            ok: false,
            msg: 'No es un archivo permitido'
        });
    }

    //Generate el nombre del archivo
    const fileName = `${uuidv4()}.${typeFile}`;

    //Path guardar archivo
    const path = `./upload/${type}/${fileName}`;

    //Mover archivo
    file.mv(path, (err) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                ok: false,
                msg: 'Error al mover el archivo'
            });
        }


        //Actualizar base de datos
        updateFile(type, id, fileName);

        res.json({
            ok: true,
            msg: 'Archivo subido',
            fileName
        });

    });
}

const getFile = (req, res = response) => {
    const type = req.params.type;
    const file = req.params.file;

    const pathFile = path.join(__dirname, `../upload/${type}/${file}`);

    //Defaul image
    if(fs.existsSync(pathFile)) {
        res.sendFile(pathFile);
    } else {
        const pathFile = path.join(__dirname, `../upload/${type}/no-image.jpg`);
        res.sendFile(pathFile);
    }


}

module.exports = {
    fileUpload,
    getFile
}