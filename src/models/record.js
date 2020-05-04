const mongoose = require('mongoose')

const recordSchema = new mongoose.Schema({
    name: {
        type: String
    },
    team1: {
        type: String
    },
    team2: {
        type: String
    },
    year: {
        type: String
    },
    week: {
        type: Number
    },
    note: {
        type: String
    },
    current: {
        type: Boolean
    }

})

const Record = mongoose.model('Record', recordSchema )

module.exports = Record;