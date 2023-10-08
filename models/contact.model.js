const { Schema, model } = require('mongoose');

const ContactSchema = Schema({
    type: {
        type: String,
        enum: ['home', 'office', 'cellPhone']
    },
    contactNo: {
        type: String,
        require: false
    },
    extNo: {
        type: String,
        require: false
    },
    isPrimary: {
        type: Boolean,
        require: false
    }
});

ContactSchema.method('toJSON', function() {
    const { _v, _id, ...object } = this.toObject();
    object.contact_id = _id;
    return object; 
});

module.exports = model('Contact', ContactSchema);