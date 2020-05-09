const _ = require('lodash');
const {Client} = require('espn-fantasy-football-api/node')
const myClient = new Client({leagueId:606204})
var mongoose = require('mongoose')
const TeamRecords = require('./models/teamRecords')

const SWID = 'A67BC139-899E-4769-A7A6-3ECC1C4C6CEA'
const espnS2 = 'AEAWzRoDdGCLxD1XZeznDjkrKWc1GGcFI9s%2FoXSAit%2BL6Ml3JdAaAAV0M4Vdl1cbm62K8uMrbBtXGJmu4lyenrnmAcDM2Lv7fEzIwmKqafOSID0YTpkcQ2dcgm8R1kWQuwTUvNcSvjL9c80gv8GwCkXpItl7wwaAauOsV8AR6xw79amYGOXZVKIubOmLidSQnh3FzDuvIBoAMa1B0RwNP%2BJwis7drFgcoYkmlrWNrcz4gc3AbVkTU9Roq%2BZ%2FsMfedirA6qvcG1ZQQhFRB1e4vI5S'
myClient.setCookies({SWID,espnS2})

const names = ['','Kevin', 'Duncan', 'Matt', 'Nick', 'Conner', 'Morgan', 'Seth', 'Erik']

class Seed {


    static updateDbHeadtoHeadPerTeam(id, seasonId) {

        this.getHeadtoHead(id, seasonId).then((data) => {

            TeamRecords.findOneAndUpdate({team_id: id, year: seasonId}, {h2h: data}).then((test) => {
                console.log('Team Records has been updated!')
            }).catch((error)=> {
                console.log('Failed to update')
            })

        })
    }


    //  Gets all the head-to-head data for a given year
    //  Returns an array of objects for each matchup in the given year
    static getHeadtoHead(id,seasonId){
        let team = []

        for(var i = 1; i < 13; i++){

            team.push(this.getMatchupData(id,i,i,seasonId));
        }

        return Promise.all(team).then((results) => {
            //console.log(results)
            return results;
        }).catch((e) => {
            console.log(e)
        })
    }


    //  This gets the individual matchup data per TEAM per SEASON
    //  This method will get called multiple times in a loop
    //  Returns an object
    static getMatchupData(id, scoringPeriodId, matchupPeriodId, seasonId) {

        let game = {};

        return myClient.getBoxscoreForWeek({seasonId, matchupPeriodId, scoringPeriodId}).then((boxscores) => {

           _.forEach(boxscores, (boxscore) => {

               if(boxscore.homeTeamId === id) {

                const oppMVP = this.getMVPForTeam(boxscore.awayRoster);
                const hostMVP = this.getMVPForTeam(boxscore.homeRoster);
                  
                      game = {
                        oppId: boxscore.awayTeamId,
                        oppName: names[boxscore.awayTeamId],
                        scoringPeriodId: scoringPeriodId,
                        matchupPeriodId: matchupPeriodId,
                        oppScore: boxscore.awayScore,
                        hostScore: boxscore.homeScore,
                        hostStartingMVP: hostMVP.startingMVP.name,
                        hostStartingMVPScore: hostMVP.startingMVP.totalPoints,
                        hostStartingMVPPosition: hostMVP.startingMVP.position,
                        hostBenchMVP: hostMVP.benchMVP.name,
                        hostBenchMVPScore: hostMVP.benchMVP.totalPoints,
                        hostBenchMVPPosition: hostMVP.benchMVP.position, 
                        oppStartingMVP: oppMVP.startingMVP.name,
                        oppStartingMVPScore: oppMVP.startingMVP.totalPoints,
                        oppStartingMVPPosition: oppMVP.startingMVP.position,
                        oppBenchMVP: oppMVP.benchMVP.name,
                        oppBenchMVPScore: oppMVP.benchMVP.totalPoints,
                        oppBenchMVPPosition: oppMVP.benchMVP.position, 
                    }

               }

               else if (boxscore.awayTeamId === id){

                  const oppMVP = this.getMVPForTeam(boxscore.homeRoster);
                  const hostMVP = this.getMVPForTeam(boxscore.awayRoster);

                      game = {
                        oppId: boxscore.homeTeamId,
                        oppName: names[boxscore.homeTeamId],
                        scoringPeriodId: scoringPeriodId,
                        matchupPeriodId: matchupPeriodId,
                        oppScore: boxscore.homeScore,
                        hostScore: boxscore.awayScore,
                        hostStartingMVP: hostMVP.startingMVP.name,
                        hostStartingMVPScore: hostMVP.startingMVP.totalPoints,
                        hostStartingMVPPosition: hostMVP.startingMVP.position,
                        hostBenchMVP: hostMVP.benchMVP.name,
                        hostBenchMVPScore: hostMVP.benchMVP.totalPoints,
                        hostBenchMVPPosition: hostMVP.benchMVP.position, 
                        oppStartingMVP: oppMVP.startingMVP.name,
                        oppStartingMVPScore: oppMVP.startingMVP.totalPoints,
                        oppStartingMVPPosition: oppMVP.startingMVP.position,
                        oppBenchMVP: oppMVP.benchMVP.name,
                        oppBenchMVPScore: oppMVP.benchMVP.totalPoints,
                        oppBenchMVPPosition: oppMVP.benchMVP.position, 

                    }                 
               }

            });

            if(game.hostScore > game.oppScore){
                game.win = true
                game.margin = Math.round((game.hostScore - game.oppScore) * 100)/100
            }
            else{
                game.win = false,
                game.margin = Math.round((game.oppScore - game.hostScore) * 100)/100
            }

            return game;

        });
    
    }

    //  Gets the highest scoring starter and bench player
    //  Returns an object with both above objects in it
    static getMVPForTeam(roster){
        let team = [];

        _.forEach(roster, (athlete) => {
            let player = {};
            player.name = athlete.player.fullName;
            player.position = athlete.position;
            player.totalPoints = athlete.totalPoints;
            team.push(player);
        })

        var benchPlayers = _.filter(team, function(o) {return o.position === 'Bench'})

        var benchMVP = benchPlayers.reduce(function(prev, current) {
            return (prev.totalPoints > current.totalPoints) ? prev : current
        })

        var startingPlayers = _.filter(team, function(o) {return o.position !== 'Bench'})


        var startingMVP = startingPlayers.reduce(function(prev, current) {
            return (prev.totalPoints > current.totalPoints) ? prev : current
        })

        const mvp = {
            benchMVP,
            startingMVP
        }
        return mvp
        

    }






}


// Seed.getHeadtoHead(1).then((data) => {
//     console.log(data);
// })

module.exports.Seed = Seed