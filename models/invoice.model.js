const { Schema, model } = require('mongoose');

const InvoiceSchema = Schema({
    rentacar: {
        type: Schema.Types.ObjectId,
        ref: 'RentACar',
        require: true
    },
    invoiceCode: {
        type: String,
        require: true
    },
    invoiceDate: {
        type: Date,
        require: true
    }
});

InvoiceSchema.method('toJSON', function() {
    const { _v, _id, ...object } = this.toObject();
    object.invoice_id = _id;
    return object; 
});

module.exports = model('Invoice', InvoiceSchema);