const mongoose = require('mongoose')

const charterSchema = new mongoose.Schema({
    member: {
        type: String
    },
    role: {
        type: String
    },
    season: [{
        year: String,
        champion: Boolean,
        finish: Number
    }],
    rank: Number

})

const Charter = mongoose.model('Charter', charterSchema )

module.exports = Charter;