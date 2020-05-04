const _ = require('lodash');
const {Client} = require('espn-fantasy-football-api/node')
const myClient = new Client({leagueId:606204})

//  Config for connecting to a private league
const SWID = process.env.SWID
const espnS2 = process.env.ESPNS2

console.log(SWID)
console.log(espnS2)

// const SWID = 'A67BC139-899E-4769-A7A6-3ECC1C4C6CEA'
// const espnS2 = 'AEAWzRoDdGCLxD1XZeznDjkrKWc1GGcFI9s%2FoXSAit%2BL6Ml3JdAaAAV0M4Vdl1cbm62K8uMrbBtXGJmu4lyenrnmAcDM2Lv7fEzIwmKqafOSID0YTpkcQ2dcgm8R1kWQuwTUvNcSvjL9c80gv8GwCkXpItl7wwaAauOsV8AR6xw79amYGOXZVKIubOmLidSQnh3FzDuvIBoAMa1B0RwNP%2BJwis7drFgcoYkmlrWNrcz4gc3AbVkTU9Roq%2BZ%2FsMfedirA6qvcG1ZQQhFRB1e4vI5S'
myClient.setCookies({SWID,espnS2})
const names = ['','Kevin', 'Duncan', 'Matt', 'Nick', 'Conner', 'Morgan', 'Seth', 'Erik']


class Historical {
    
    //  Need to make this all more efficient
    static getPointsForYear({seasonId, scoringPeriodId}) {
        const year = {};
        return myClient.getTeamsAtWeek({seasonId, scoringPeriodId}).then((teams) => {
            _.forEach(teams, (team) => {
                                        year[team.id] = {
                                        id: team.id,
                                        name: names[team.id],
                                        teamName: team.name,
                                        totalPoints: Math.max(Math.round((team.totalPointsScored) * 10)/10, 2.8), 
                                        pointsFor: Math.max(Math.round((team.regularSeasonPointsFor) * 10)/10, 2.8), 
                                        pointsAgainst: Math.max(Math.round((team.regularSeasonPointsAgainst) * 10)/10, 2.8), 
                                        difference: Math.max(Math.round((team.regularSeasonPointsFor - team.regularSeasonPointsAgainst))),
                                        wins: team.wins,
                                        losses: team.losses
                                     }
            })
            return year;
        });

    }

    static getHistoricalData({seasonId, scoringPeriodId}) {
        const history = {
            year2018: {},
            year2019: {},
            Totals: []
        };

        this.getPointsForYear({seasonId, scoringPeriodId}).then((year) => {
            history.year2018 = year;
        })

        return this.getPointsForYear({seasonId:2019, scoringPeriodId}).then((year) => {
            history.year2019 = year;


            for (var i = 1; i < 9; i++){
                var obj = {}
                const team2018 = _.find(history.year2018, {'id': i})
                const team2019 = _.find(history.year2019, {'id': i})
                obj = {  id: team2018.id,
                            name: names[i],
                            totalPoints: team2018.totalPoints + team2019.totalPoints,
                            totalRegularSeasonPointsFor: Math.max(Math.round((team2018.pointsFor + team2019.pointsFor) * 10)/10, 2.8),
                            totalRegularSeasonPointsAgainst: team2018.pointsAgainst + team2019.pointsAgainst,
                            difference: team2018.difference + team2019.difference
                         }


                history.Totals.push(obj);
            }
         return history;
    })
    }

    //  Need to Add a method to get Total number of years in the league

}

module.exports.Historical = Historical

// Historical.getPointsForYear({seasonId: 2018,scoringPeriodId: 12}).then((results) => {
//     console.log(results)
// })

// Historical.getHistoricalData({seasonId:2018, scoringPeriodId: 2}).then((results) => {
//     console.log(results)
// })

Historical.getPointsForYear({seasonId: 2018, scoringPeriodId:12}).then((results) => {
    console.log(results);
})