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
    h2h: [
        game = {
            oppId: Number,
            oppName: String,
            seasonId: Number,
            scoringPeriodId: Number,
            matchupPeriodId: Number,
            oppScore: Number,
            hostScore: Number,
            win: Boolean,
            margin: Number,
            hostStartingMVP: String,
            hostStartingMVPScore: Number,
            hostStartingMVPPosition: String,
            hostBenchMVP: String,
            hostBenchMVPScore: Number,
            hostBenchMVPPosition: String,
            oppStartingMVP: String,
            oppStartingMVPScore: Number,
            oppStartingMVPPosition: String,
            oppBenchMVP: String,
            oppBenchMVPScore: Number,
            oppBenchMVPPosition: String,
            lowestMargin: Number,
            largestMargin: Number,
            wins: Number,
            losses: Number
        }
    ]
});



const TeamRecords = mongoose.model('TeamRecords', teamRecordsSchema )

module.exports = TeamRecords;