const mongoose = require('mongoose')

const keeperSchema = new mongoose.Schema({
    name: {
        type: String
    },
    teamId: {
        type: Number
    },
    yearsLeft: {
        type: String
    },
    active: {
        type: String
    },
    image: {
        type: String
    }
})

const Keeper = mongoose.model('Keeper', keeperSchema )

module.exports = Keeper;