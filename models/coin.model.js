const { Schema, model } = require('mongoose');

const CoinSchema = Schema({
    symbol: {
        type: String,
        required: true
    },
    coinName: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        require: false,
        default: true
    }
});

CoinSchema.method('toJSON', function() {
    const { _v, _id, ...object } = this.toObject();
    object.coin_id = _id;
    return object; 
});

module.exports = model('Coin', CoinSchema);