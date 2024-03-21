const { Schema, model } = require('mongoose');

const DocumentSchema = Schema({
    typeDocument: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        require: false,
        default: true
    }
});

DocumentSchema.method('toJSON', function() {
    const { _v, _id, ...object } = this.toObject();
    object.document_id = _id;
    return object; 
});

module.exports = model('Document', DocumentSchema);