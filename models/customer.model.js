const { Schema, model } = require('mongoose');

const CustomerSchema = Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    document: {
        type: String,
        unique: true,
        required: true
    },
    typeDocument: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: false,
        unique: true,
    },
    status: {
        type: Boolean,
        require: false,
        default: true
    }
});

CustomerSchema.method('toJSON', function() {
    const { _v, _id, ...object } = this.toObject();
    object.customer_id = _id;
    return object; 
});

module.exports = model('Customer', CustomerSchema);