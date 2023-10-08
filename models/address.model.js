const { Schema, model } = require('mongoose');

const AddressSchema = Schema({
    type: {
        type: String,
        enum: ['home', 'office']
    },
    street: {
        type: String,
        require: false
    },
    number: {
        type: Number,
        require: false
    },
    building: {
        type: String,
        require: false
    },
    apartment: {
        type: String,
        require: false
    },
    city: {
        type: String,
        require: false
    },
    sector: {
        type: String,
        require: false
    },
    isPrimary: {
        type: Boolean,
        require: false
    }
});

AddressSchema.method('toJSON', function() {
    const { _v, _id, ...object } = this.toObject();
    object.address_id = _id;
    return object; 
});

module.exports = model('Address', AddressSchema);