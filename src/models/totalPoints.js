const mongoose = require('mongoose')

const totalPointsSchema = new mongoose.Schema({
    team_id: {
        type: Number
    },
    name: {
        type: String
    },
    year: {
        type: String
    },
    pointsFor: {
        type: Number
    },
    pointsAgainst: {
        type: Number
    },
    difference: {
        type: Number
    }

})

const TotalPoints = mongoose.model('TotalPoints', totalPointsSchema )

module.exports = TotalPoints;