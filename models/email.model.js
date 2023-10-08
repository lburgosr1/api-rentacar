const { Schema, model } = require('mongoose');

const EmailSchema = Schema({
    email: {
        type: String,
        require: false
    },
    isPrimary: {
        type: Boolean,
        require: false
    }
});

EmailSchema.method('toJSON', function() {
    const { _v, _id, ...object } = this.toObject();
    object.email_id = _id;
    return object; 
});

module.exports = model('Email', EmailSchema);