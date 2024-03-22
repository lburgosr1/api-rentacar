const { Schema, model } = require('mongoose');

const EmployeeSchema = Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
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
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    status: {
        type: Boolean,
        require: false,
        default: true
    }
});

EmployeeSchema.method('toJSON', function() {
    const { _v, _id, ...object } = this.toObject();
    object.employee_id = _id;
    return object; 
});

module.exports = model('Employee', EmployeeSchema);