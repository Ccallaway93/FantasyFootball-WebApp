const _ = require('lodash');
const {Client} = require('espn-fantasy-football-api/node')
const myClient = new Client({leagueId:606204})
var mongoose = require('mongoose')
const TeamRecords = require('./models/teamRecords')

//  Config for connecting to a private league
// const SWID = process.env.SWID
// const espnS2 = process.env.ESPNS2

// console.log(SWID)
// console.log(espnS2)

const SWID = 'A67BC139-899E-4769-A7A6-3ECC1C4C6CEA'
const espnS2 = 'AEAWzRoDdGCLxD1XZeznDjkrKWc1GGcFI9s%2FoXSAit%2BL6Ml3JdAaAAV0M4Vdl1cbm62K8uMrbBtXGJmu4lyenrnmAcDM2Lv7fEzIwmKqafOSID0YTpkcQ2dcgm8R1kWQuwTUvNcSvjL9c80gv8GwCkXpItl7wwaAauOsV8AR6xw79amYGOXZVKIubOmLidSQnh3FzDuvIBoAMa1B0RwNP%2BJwis7drFgcoYkmlrWNrcz4gc3AbVkTU9Roq%2BZ%2FsMfedirA6qvcG1ZQQhFRB1e4vI5S'
myClient.setCookies({SWID,espnS2})


class Standings {

    //  This gets all team records per Team ID
    //  returns an array of objects
    static getPastSeasonRecord(id) {

        return TeamRecords.find({'team_id': id}, (error, years) => {
            if (error) {
                console.log(error)
            }
            else{
                //console.log(years);
                 return years
            }
        });

    };

    //  Adds each team sent by the Id to an object and adds extra values
    //  Returns an object
    static addTeamToObject(id) {
        let totals = {}
        let wins = 0
        let losses = 0
        let moves = 0
        let percentage = 0.0
        let games = 0
        let championships = 0
        let averageStandings = 0
        let years = 0
        let finish = 0

         return this.getPastSeasonRecord(id).then((teams) => {
            _.forEach(teams, (team) => { 

                wins = team.wins + wins;
                losses = team.losses + losses;
                moves = team.moves + moves;
                years++;
                finish = team.finalStanding + finish;
                if(team.finalStanding === 1){
                    championships++
                }
                else{
                    championships = championships;
                }

                

            })

            games = wins + losses;

            totals = {
                id: teams[0].team_id,
                name: teams[0].name,
                wins: wins,
                losses: losses,
                moves: moves,
                percentage: Math.floor((wins/games) * 100),
                championships: championships,
                years: years,
                averageFinish: Math.round(finish/years)
            }
             return totals;
         })
    }

    //  Gets the yearly win and loss totals
    //  Returns an array of objects
    static getRegularSeasonStandings() {

        let totals = [];

        for (var i = 1; i < 9; i++){
            totals.push(this.addTeamToObject(i));
        }

        return Promise.all(totals).then((results) => {
            //console.log('All Dones', results)
            return results;
        }).catch((e) => {
            console.log(e)
        })

    }
    

}





module.exports.Standings = Standings