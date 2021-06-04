const mongoose = require('mongoose');
require('mongoose-double')(mongoose);
const mongoosePaginate = require('mongoose-paginate-v2');

let CurrencySchema = new mongoose.Schema({
    name: String,
    rate: mongoose.SchemaTypes.Double,
    code: String
});

CurrencySchema.plugin(mongoosePaginate);
mongoose.model('Currency', CurrencySchema);