const mongoose = require('mongoose')

const hotTakesSchema = new mongoose.Schema({
    bet: {
        type: String
    },
    term: {
        type: String
    },
    year: {
        type: String
    },
    persons: [{
        name: String,
        bettor: Boolean,
        winner: Boolean,
        hotTake: Boolean,
        note: String
    }]

})

const HotTake = mongoose.model('HotTake', hotTakesSchema )

module.exports = HotTake;