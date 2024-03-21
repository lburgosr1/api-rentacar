const { Schema, model } = require('mongoose');

const VehicleModelSchema = Schema({
    vehicleModel: {
        type: String,
        required: true
    },
    brand: {
        type: Schema.Types.ObjectId,
        ref: 'BrandVehicle',
        required: true
    },
    status: {
        type: Boolean,
        require: false,
        default: true
    }
});

VehicleModelSchema.method('toJSON', function() {
    const { _v, _id, ...object } = this.toObject();
    object.vehicle_model_id = _id;
    return object; 
});

module.exports = model('VehicleModel', VehicleModelSchema);