const mongoose = require('mongoose')

const noteWorthyGamesSchema = new mongoose.Schema({
    year: {
        type: String
    },
    week: {
        type: Number
    },
    team1: {
        type: String
    },
    team2: {
        type: String
    },
    significance: {
        type: String
    }
});



const NoteWorthyGames = mongoose.model('NoteWorthyGames', noteWorthyGamesSchema )

module.exports = NoteWorthyGames;