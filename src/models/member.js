const mongoose = require('mongoose')

const memberSchema = new mongoose.Schema({
    team_id: Number,
    name: String,
    role: String,
    currentStanding: Number,
    active: Boolean,
    wins: Number,
    losses: Number,
    playoffWins: Number, 
    playoffLosses: Number, 
    winPercentage: Number,
    moves: Number,
    totalPoints: Number,
    totalPointsAgainst: Number,
    different: Number,
    averagePoints: Number,
    averagePointsAgainast: Number,
    championships: Number,
    lastPlaceFinishes: Number,
    championshipAppearances: Number,
    playoffAppearances: Number,
    averageFinish:Number,
    years: Number,
    highestScore: {
        score: Number,
        week: Number,
        oppName: String,
        season: Number
    },
    lowestScore: {
        score: Number,
        week: Number,
        oppName: String,
        season: Number
    },
    biggestWinMargin: {
        margin: Number,
        week: Number,
        oppName: String,
        season: Number
    },
    lowestWinMargin: {
        margin: Number,
        week: Number,
        oppName: String,
        season: Number
    },
    biggestLossMargin: {
        margin: Number,
        week: Number,
        oppName: String,
        season: Number
    },
    lowestLossMargin: {
        margin: Number,
        week: Number,
        oppName: String,
        season: Number
    },
    MVP: {
        fullName: String,
        points: Number,
        position: String,
        week: Number,
        season: Number,
        oppName: String,
        keeper: Boolean
    },
    seasons: [
        year = {
            seasonId: Number,
            teamName: String,
            personalDraftGrade: String,
            leagueDraftGrade: String,
            draftRoster: [
                player = {
                    fullName: String,
                    position: String,
                    proTeam: String,
                    proTeamAbbreviation: String,
                    keeper: Boolean,
                    keeperElgibility: Number
                }
            ],
            playoffRoster: [
                player ={
                    fullName: String,
                    position: String,
                    proTeam: String,
                    proTeamAbbreviation: String,
                    keeper: Boolean,
                    keeperElgibility: Number
                }
            ]

        },
    ]
});



const Member = mongoose.model('Member', memberSchema )

module.exports = Member;