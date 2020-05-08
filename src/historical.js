const _ = require('lodash');
const {Client} = require('espn-fantasy-football-api/node')
const myClient = new Client({leagueId:606204})
var mongoose = require('mongoose')
const TeamRecords = require('./models/teamRecords')
const TotalPoints = require('./models/totalPoints')
const Records = require('./models/record')

//  Config for connecting to a private league
// const SWID = process.env.SWID
// const espnS2 = process.env.ESPNS2

// console.log(SWID)
// console.log(espnS2)

 const SWID = 'A67BC139-899E-4769-A7A6-3ECC1C4C6CEA'
 const espnS2 = 'AEAWzRoDdGCLxD1XZeznDjkrKWc1GGcFI9s%2FoXSAit%2BL6Ml3JdAaAAV0M4Vdl1cbm62K8uMrbBtXGJmu4lyenrnmAcDM2Lv7fEzIwmKqafOSID0YTpkcQ2dcgm8R1kWQuwTUvNcSvjL9c80gv8GwCkXpItl7wwaAauOsV8AR6xw79amYGOXZVKIubOmLidSQnh3FzDuvIBoAMa1B0RwNP%2BJwis7drFgcoYkmlrWNrcz4gc3AbVkTU9Roq%2BZ%2FsMfedirA6qvcG1ZQQhFRB1e4vI5S'
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
                obj = {     id: team2018.id,
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

    //  Gets the each trips to the playoffs and counts and adds it to an object
    //  Returns an object with id, name, years, and count of playoffs
    static getTripsToThePlayoffs(id){
        let playoffTeam = {};
        let years = []
        let name = ''
        let team_id = 0;

        return TeamRecords.find({'playoffs': true, 'team_id': id}).then((data) => {
            
            _.forEach(data, (team) => {
                
                    years.push(team.year)
                    name = team.name
                    team_id = team.team_id
            })

            playoffTeam = {
                id: team_id,
                name: name,
                years: years,
                total: years.length
            };
            return playoffTeam

        })

    }

    static getHistoricalPlayoffTeams(){
        
        let playoffs = [];

        for(var i = 1; i < 9; i++){
            playoffs.push(this.getTripsToThePlayoffs(i));
        }

        return Promise.all(playoffs).then((results) => {
            //console.log('All Dones', results)
            return results;
        }).catch((e) => {
            console.log(e)
        })

    }

    static getAllHistoricalData(){
        let total = [];


        const playoffs = this.getHistoricalPlayoffTeams().then((data) => {return data})
        total.push(playoffs);


       const points =  TotalPoints.find({}).then((data) => {
           return data;
        }).catch((error) => {
            console.log(error)
        })
        total.push(points);

        const records = Records.find({'current': true}).then((data) => {
            return data;
        }).catch((error) => {
            console.log(error)
        })
        total.push(records)


        return Promise.all(total).then((results) => {
            const data = {
                playoffs: results[0],
                points: results[1],
                records: results[2]
            };
            console.log(data)
            return data;
        }).catch((e) => {
            console.log(e)
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

// Historical.getPointsForYear({seasonId: 2018, scoringPeriodId:12}).then((results) => {
//     console.log(results);
// })