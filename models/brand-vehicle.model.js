const { Schema, model } = require('mongoose');

const BrandVehicleSchema = Schema({
    brandVehicle: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        require: false,
        default: true
    }
});

BrandVehicleSchema.method('toJSON', function() {
    const { _v, _id, ...object } = this.toObject();
    object.brand_vehicle_id = _id;
    return object; 
});

module.exports = model('BrandVehicle', BrandVehicleSchema);