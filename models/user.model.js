const { Schema, model } = require('mongoose');

const UserSchema = Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    role: {
        type: String,
        required: false,
        default: 'USER_ROLE'
    },
    status: {
        type: Boolean,
        require: false,
        default: true
    }
});

UserSchema.method('toJSON', function() {
    const { _v, _id, password, ...object } = this.toObject();
    object.user_id = _id;
    return object; 
});

module.exports = model('User', UserSchema);