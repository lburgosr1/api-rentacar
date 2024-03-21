const { Schema, model } = require('mongoose');

const CompanySchema = Schema({
    rnc: {
        type: String,
        required: true,
        unique: true,
    },
    companyName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: false,
        unique: true,
    },
    address: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: false
    }
});

CompanySchema.method('toJSON', function() {
    const { _v, _id, ...object } = this.toObject();
    object.company_id = _id;
    return object; 
});

module.exports = model('Company', CompanySchema);