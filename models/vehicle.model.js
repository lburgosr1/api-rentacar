const { Schema, model } = require('mongoose');

const VehicleSchema = Schema({
    brand: {
        type: Schema.Types.ObjectId,
        ref: 'BrandVehicle',
        required: true
    },
    model: {
        type: Schema.Types.ObjectId,
        ref: 'VehicleModel',
        required: true
    },
    typeVehicle: {
        type: Schema.Types.ObjectId,
        ref: 'TypeVehicle',
        required: true
    },
    plate: {
        type: String,
        required: true,
        unique: true
    },
    year: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: false
    },
    status: {
        type: String,
        enum: [
            'active', 
            'disabled',
            'rented'
        ],
        require: false,
        default: 'active'
    }
});

VehicleSchema.method('toJSON', function() {
    const { _v, _id, ...object } = this.toObject();
    object.vehicle_id = _id;
    return object; 
});

module.exports = model('Vehicle', VehicleSchema);