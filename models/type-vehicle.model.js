const { Schema, model } = require('mongoose');

const TypeVehicleSchema = Schema({
    typeVehicle: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        require: false,
        default: true
    }
});

TypeVehicleSchema.method('toJSON', function() {
    const { _v, _id, ...object } = this.toObject();
    object.type_vehicle_id = _id;
    return object; 
});

module.exports = model('TypeVehicle', TypeVehicleSchema);