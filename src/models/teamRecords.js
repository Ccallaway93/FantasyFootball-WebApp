const mongoose = require('mongoose')

const teamRecordsSchema = new mongoose.Schema({
    team_id: {
        type: Number
    },
    name: {
        type: String
    },
    year: {
        type: String
    },
    wins: {
        type: Number
    },
    losses: {
        type: Number
    },
    winPercentage: {
        type: Number
    },
    moves: {
        type: Number
    },
    finalStanding: {
        type: Number
    },
    playoffs: {
        type: Boolean
    },
    h2h: [{
        team_id: Number,
        name: String,
        wins: Number,
        losses: Number
    }]
});



const TeamRecords = mongoose.model('TeamRecords', teamRecordsSchema )

module.exports = TeamRecords;