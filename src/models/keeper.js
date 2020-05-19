const mongoose = require('mongoose')

const keeperSchema = new mongoose.Schema({
    name: {
        type: String
    },
    yearsLeft: {
        type: String
    },
    active: {
        type: String
    }
})

const Keeper = mongoose.model('Keeper', keeperSchema )

module.exports = Keeper;