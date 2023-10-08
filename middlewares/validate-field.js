const { response } = require('express')
const { validationResult } = require('express-validator');

const validateField = (req, res = response, next) => {
    
    const errs = validationResult(req); 

    if(!errs.isEmpty()) {
        return res.status(400).json({
            ok: false,
            errors: errs.mapped()
        })
    }

    next();
}

module.exports = {
    validateField
}