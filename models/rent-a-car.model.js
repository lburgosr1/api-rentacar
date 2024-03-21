const { Schema, model } = require('mongoose');

const RentACarSchema = Schema({
    customer: {
        type: Schema.Types.ObjectId,
        ref: 'Customer',
        require: true
    },
    vehicle: {
        type: Schema.Types.ObjectId,
        ref: 'Vehicle',
        require: true
    },
    document: {
        type: Schema.Types.ObjectId,
        ref: 'Document',
        require: true
    },
    coin: {
        type: Schema.Types.ObjectId,
        ref: 'Coin',
        require: true
    },
    status: {
        type: String,
        enum: [
            'available',
            'rented'
        ],
        require: false,
        default: 'available'
    },
    amount: {
        type: Number,
        require: false
    },
    deposit: {
        type: Number,
        require: false
    },
    rentalStartDate: {
        type: Date,
        require: true
    },
    rentalEndDate: {
        type: Date,
        require: true
    },
    daysOfRent: {
        type: Number,
        require: true
    },
    pricePerDay: {
        type: Number,
        require: true
    },
    notes: {
        type: String,
        require: false
    },
});

RentACarSchema.method('toJSON', function() {
    const { _v, _id, ...object } = this.toObject();
    object.rentACar_id = _id;
    return object; 
});

module.exports = model('RentACar', RentACarSchema);