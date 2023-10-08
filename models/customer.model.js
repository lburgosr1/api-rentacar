const { Schema, model } = require('mongoose');
const Address = require('./address.model');
const Contact = require('./contact.model');
const Email = require('./email.model');

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
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    addresses: {type: [Address.schema]},
    contacts: {
        type: [{
            contacts: { type: [Contact.schema] },
            emails: { type: [Email.schema] }
        }]
    },
});

CustomerSchema.method('toJSON', function() {
    const { _v, _id, ...object } = this.toObject();
    object.customer_id = _id;
    return object; 
});

module.exports = model('Customer', CustomerSchema);