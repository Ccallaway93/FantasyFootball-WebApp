const _ = require('lodash');
const {Client} = require('espn-fantasy-football-api/node')
const myClient = new Client({leagueId:606204})
var mongoose = require('mongoose')
const TeamRecords = require('./models/teamRecords')
const TotalPoints = require('./models/totalPoints')
const Records = require('./models/record')
const Members = require('./models/member')

//  Config for connecting to a private league
// const SWID = process.env.SWID
// const espnS2 = process.env.ESPNS2

// console.log(SWID)
// console.log(espnS2)

 const SWID = 'A67BC139-899E-4769-A7A6-3ECC1C4C6CEA'
 const espnS2 = 'AEAWzRoDdGCLxD1XZeznDjkrKWc1GGcFI9s%2FoXSAit%2BL6Ml3JdAaAAV0M4Vdl1cbm62K8uMrbBtXGJmu4lyenrnmAcDM2Lv7fEzIwmKqafOSID0YTpkcQ2dcgm8R1kWQuwTUvNcSvjL9c80gv8GwCkXpItl7wwaAauOsV8AR6xw79amYGOXZVKIubOmLidSQnh3FzDuvIBoAMa1B0RwNP%2BJwis7drFgcoYkmlrWNrcz4gc3AbVkTU9Roq%2BZ%2FsMfedirA6qvcG1ZQQhFRB1e4vI5S'
myClient.setCookies({SWID,espnS2})
const names = ['','Kevin', 'Duncan', 'Matt', 'Nick', 'Conner', 'Morgan', 'Seth', 'Erik']



class updateWeeklyRecords {


    static update(seasonId, scoringPeriodId, matchupPeriodId){

        let allTeams = [];
        let weekStatsPerHomeTeam = {}
        let weekStatsPerAwayTeam = {}


        // Making an API call 1 time to gather data on the boxscores for week
        myClient.getBoxscoreForWeek({seasonId, matchupPeriodId, scoringPeriodId}).then((boxscores) => {

            // sections out each team and adds it to an object to send to other methods
            _.forEach(boxscores, function(boxscore) {

                weekStatsPerHomeTeam = {
                    hostId: boxscore.homeTeamId,
                    oppID: boxscore.awayTeamId,
                    week: scoringPeriodId,
                    season: seasonId,
                    hostScore: boxscore.homeScore,
                    oppScore: boxscore.awayScore,
                    hostRoster: boxscore.homeRoster,
                    oppRoster: boxscore.awayRoster,
                    win: boxscore.homeScore > boxscore.awayScore ? 1 : 0,
                    loss: boxscore.homeScore < boxscore.awayScore ? 1 : 0,
                    margin: Math.abs(Math.round((boxscore.homeScore - boxscore.awayScore)*100)/100) 
                };

                allTeams.push(weekStatsPerHomeTeam);

                
                weekStatsPerAwayTeam = {
                    hostId: boxscore.awayTeamId,
                    oppID: boxscore.homeTeamId,
                    week: scoringPeriodId,
                    season: seasonId,
                    hostScore: boxscore.awayScore,
                    oppScore: boxscore.homeScore,
                    hostRoster: boxscore.awayRoster,
                    oppRoster: boxscore.homeRoster,
                    win: boxscore.awayScore > boxscore.homeScore ? 1 : 0,
                    loss: boxscore.awayScore < boxscore.homeScore ? 1 : 0,
                    margin: Math.abs(Math.round((boxscore.awayScore - boxscore.homeScore)*100)/100) 
                };

                allTeams.push(weekStatsPerAwayTeam);

            })

            this.updateGeneralInfo(allTeams, seasonId);  // This should only be ran ONCE per week!
            this.updateScores(allTeams);
            this.updateMargins(allTeams);
            this.updateMVP(allTeams);  
            this.updateTotalPoints(allTeams, seasonId);
            this.updateTeamRecords(allTeams, seasonId, scoringPeriodId, matchupPeriodId);
        })

        // updates the current standing
        // myClient.getTeamsAtWeek({seasonId, scoringPeriodId}).then((teams) => {
        //     this.updateCurrentStanding(teams, seasonId)
        // })

    }


    static async updateTeamTotals(teamId, game){

        const hostTeamTotal = await TeamRecords.findOne({ team_id: teamId, year: 'Total'}); // DB info For Team Records
        const oppRecord = _.find(hostTeamTotal.h2h, function(o) {return o.oppId === game.oppId});


        const updatedTotals = {
            oppScore: oppRecord.oppScore + game.oppScore,
            hostScore: oppRecord.hostScore + game.hostScore,
            hostStartingMVP: oppRecord.hostStartingMVP,
            hostStartingMVPScore: oppRecord.hostStartingMVPScore,
            hostBenchMVP: oppRecord.hostBenchMVP,
            hostBenchMVPScore: oppRecord.hostBenchMVPScore,
            oppStartingMVP: oppRecord.oppStartingMVP,
            oppStartingMVPScore: oppRecord.oppStartingMVPScore,
            lowestMargin: oppRecord.lowestMargin,
            largestMargin: oppRecord.largestMargin,
            wins: oppRecord.wins,
            losses: oppRecord.losses
        };
    
        //  Update the MVP totals
        if(game.hostStartingMVPScore > oppRecord.hostStartingMVPScore){
            updatedTotals.hostStartingMVP = game.hostStartingMVP
            updatedTotals.hostStartingMVPScore = game.hostStartingMVPScore
        }

        if(game.hostBenchMVPScore > oppRecord.hostBenchMVPScore){
            updatedTotals.hostBenchMVP = game.hostBenchMVP
            updatedTotals.hostBenchMVPScore = game.hostBenchMVPScore
        }

        if(game.oppStartingMVPScore > oppRecord.oppStartingMVPScore){
            updatedTotals.oppStartingMVP = game.oppStartingMVP
            updatedTotals.oppStartingMVPScore = game.oppStartingMVPScore
        }

        //  Update wins/losses
       // updatedTotals.wins ? updatedTotals.wins += 1 : updatedTotals.losses += 1

        if(game.win){
            updatedTotals.wins += 1
        }
        else{
            updatedTotals.losses += 1
        }

        //  Update Margins
        if(game.win){
            if(updatedTotals.lowestMargin == 0){
                updatedTotals.lowestMargin = game.margin
            }
            if(game.margin < updatedTotals.lowestMargin){
                updatedTotals.lowestMargin = game.margin
            }
    
            if(game.margin > updatedTotals.largestMargin){
                updatedTotals.largestMargin = game.margin
            }
        }


        const query = {
            team_id: teamId,
            year: 'Total'
        };

        TeamRecords.findOne(query).then((doc) => {
            const h2hDocument = _.find(doc.h2h, function(o) {return o.oppId === game.oppId});

            h2hDocument.oppScore = updatedTotals.oppScore;
            h2hDocument.hostScore = updatedTotals.hostScore;
            h2hDocument.hostStartingMVP = updatedTotals.hostStartingMVP;
            h2hDocument.hostStartingMVPScore = updatedTotals.hostStartingMVPScore;
            h2hDocument.hostBenchMVP = updatedTotals.hostBenchMVP;
            h2hDocument.hostBenchMVPScore = updatedTotals.hostBenchMVPScore;
            h2hDocument.oppStartingMVP = updatedTotals.oppStartingMVP;
            h2hDocument.oppStartingMVPScore = updatedTotals.oppStartingMVPScore;
            h2hDocument.lowestMargin = updatedTotals.lowestMargin;
            h2hDocument.largestMargin = updatedTotals.largestMargin;
            h2hDocument.wins = updatedTotals.wins;
            h2hDocument.losses = updatedTotals.losses;

            doc.save();
            console.log('updated Total TeamRecords for: ' + names[teamId])


            
        }).catch((error) => {
            console.log('Error inside of updated Total TeamRecords for ' + names[teamId] + error);
        })


    }

    static async updateTeamRecords (boxscores, seasonId, scoringPeriodId, matchupPeriodId) {


        for(var i = 1; i < 9; i++){

            const teamRecordsTeam = await TeamRecords.findOne({ team_id: i, year: seasonId}); // DB info For Team Records
            const currentTeam =  _.find(boxscores, function(o) {return o.hostId === i}); // API data for week

            const general = {
                wins: teamRecordsTeam.wins + currentTeam.win,
                losses: teamRecordsTeam.losses + currentTeam.loss,
                winPercentage: Math.round(((currentTeam.win + teamRecordsTeam.wins) / (currentTeam.win + teamRecordsTeam.wins + currentTeam.loss + teamRecordsTeam.losses))*100)
            }

            const oppMVPs = this.getMVPforWeek(currentTeam.oppRoster);
            const hostMVPs = this.getMVPforWeek(currentTeam.hostRoster);

            const data = {
                oppId: currentTeam.oppID,
                oppName: names[currentTeam.oppID],
                seasonId: seasonId,
                scoringPeriodId: scoringPeriodId,
                matchupPeriodId: matchupPeriodId,
                oppScore: currentTeam.oppScore,
                hostScore: currentTeam.hostScore,
                hostStartingMVP: hostMVPs.startingMVP.name,
                hostStartingMVPScore: hostMVPs.startingMVP.totalPoints,
                hostStartingMVPPosition: hostMVPs.startingMVP.position,
                hostBenchMVP: hostMVPs.benchMVP.name,
                hostBenchMVPScore: hostMVPs.benchMVP.totalPoints,
                hostBenchMVPPosition: hostMVPs.benchMVP.position,
                oppStartingMVP: oppMVPs.startingMVP.name,
                oppStartingMVPScore: oppMVPs.startingMVP.totalPoints,
                oppStartingMVPPosition: oppMVPs.startingMVP.position,
                oppBenchMVP: oppMVPs.benchMVP.name,
                oppBenchMVPScore: oppMVPs.benchMVP.totalPoints,
                oppBenchMVPPosition: oppMVPs.benchMVP.position,
                win: currentTeam.win === 1 ? true : false,
                margin: currentTeam.margin
            };

            this.updateTeamTotals(i, data);

            TeamRecords.updateOne({'team_id': i, 'year': seasonId}, {$push: {'h2h': data}, 'wins': general.wins, 'losses': general.losses, 'winPercentage': general.winPercentage}).then((data) => {
                console.log('updated current TeamRecords Standing for: ' + names[i - 1]);
            }).catch((error) => {
                console.log('Error inside of updating current TeamRecords Standing for: ' + names[i - 1] + error)
            });

        }
    }

    //  updates Season totals in the TotalPoints collection DB
    static async updateTotalPoints(boxscores, seasonId) {

        for(var i = 1; i < 9; i++) {

            const totalPoints = await TotalPoints.findOne({team_id: i, year: seasonId}); // DB info for Total Points
            const currentTeam =  _.find(boxscores, function(o) {return o.hostId === i}); // API data for week

            const data = {
                pointsFor: Math.round((totalPoints.pointsFor + currentTeam.hostScore)*100)/100,
                pointsAgainst: Math.round((totalPoints.pointsAgainst + currentTeam.oppScore)*100)/100,
                difference: Math.round(((totalPoints.pointsFor + currentTeam.hostScore) - (totalPoints.pointsAgainst + currentTeam.oppScore))*100)/100
            }


           TotalPoints.updateOne({'team_id': i, 'year': seasonId}, {'pointsFor': data.pointsFor, 'pointsAgainst': data.pointsAgainst, 'difference': data.difference}).then((data) => {
                console.log('updated Total Points for: ' + names[i - 1]);
            }).catch((error) => {
                console.log('Error inside of updating Total Points for: ' + names[i - 1] + error)
            });

        }
    }

    // This grabs the currentstanding
    static async updateCurrentStanding (teams, seasonId) {
        
        for(var i = 1; i < 9; i++){

            const team = _.filter(teams, function(o) {return o.id === i}); // API data for week
            const memberTeam = await Members.findOne({ team_id: i}); // DB info

            Members.updateOne({'team_id': i}, {'currentStanding': team[0].playoffSeed}).then((data) => {
                console.log('updated current Member Standing for: ' + names[i - 1]);
            }).catch((error) => {
                console.log('Error inside of updating current Member Standing for: ' + names[i - 1] + error)
            });

            TeamRecords.updateOne({'team_id': i, 'year': seasonId}, {'finalStanding': team[0].playoffSeed}).then((data) => {
                console.log('updated current TeamRecords Standing for: ' + names[i - 1]);
            }).catch((error) => {
                console.log('Error inside of updating current TeamRecords Standing for: ' + names[i - 1] + error)
            });

        }

    }

    // updates general info on the Member collection
    static async updateGeneralInfo (boxscores) {

        var today = new Date();
        var date = (today.getMonth()+1)+'-'+today.getDate()+'-'+today.getFullYear();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date+' '+time;

        for(var i = 1; i < 9; i++){

            var currentTeam =  _.find(boxscores, function(o) {return o.hostId === i}); // API data for week
            const memberTeam = await Members.findOne({ team_id: i}); // DB info for Member
            

            let general = {
                wins: currentTeam.win + memberTeam.wins,
                losses: currentTeam.loss + memberTeam.losses,
                totalPoints: currentTeam.hostScore + memberTeam.totalPoints,
                totalPointsAgainst: currentTeam.oppScore + memberTeam.totalPointsAgainst,
                winPercentage: Math.round(((currentTeam.win + memberTeam.wins) / (currentTeam.win + memberTeam.wins + currentTeam.loss + memberTeam.losses))*100),
                different: Math.round(((currentTeam.hostScore + memberTeam.totalPoints) - (currentTeam.oppScore + memberTeam.totalPointsAgainst))*100)/100,
                averagePoints: Math.round(((currentTeam.hostScore + memberTeam.totalPoints) / (currentTeam.win + memberTeam.wins + currentTeam.loss + memberTeam.losses))*100)/100,
                currentstanding: memberTeam.currentStanding,
            };

            Members.updateOne({'team_id': i}, {'wins': general.wins, 'losses': general.losses, 'totalPoints': general.totalPoints, 'totalPointsAgainst': general.totalPointsAgainst, 'winPercentage': general.winPercentage, 'different': general.different, 'averagePoints': general.averagePoints, 'lastUpdated':dateTime }).then((data) => {
                console.log('updated General for: ' + names[i - 1]);
            }).catch((error) => {
                console.log('Error inside of updating General for: ' + names[i - 1] + error)
            });

        }



    }

    //updates the highest and lowest scores objects in each member object
    static async updateScores (boxscores) {

       for(var i = 1; i < 9; i++) {

         var currentTeam =  _.find(boxscores, function(o) {return o.hostId === i}); // API data for week
         const memberTeam = await Members.findOne({ team_id: i}); // DB info

        // This will update the highest score obj if the current weeks score was higher
            if(currentTeam.hostScore > memberTeam.highestScore.score){
                Members.updateOne({'team_id': i}, {'highestScore.score': currentTeam.hostScore, 'highestScore.week': currentTeam.week, 'highestScore.season': currentTeam.season, 'highestScore.oppName': names[currentTeam.oppID] }).then((data) => {
                    console.log('updated Highest Score for: ' + names[i -1]);
                }).catch((error) => {
                    console.log('Error inside of updating Highest Score for: ' + names[i - 1] + error)
                });
            }

        //  This will update the lowest score obj if the current weeks score was lower
            if(currentTeam.hostScore < memberTeam.lowestScore.score){
                Members.updateOne({'team_id': i}, {'lowestScore.score': currentTeam.hostScore, 'lowestScore.week': currentTeam.week, 'lowestScore.season': currentTeam.season, 'lowestScore.oppName': names[currentTeam.oppID] }).then((data) => {
                    console.log('updated Lowest Score for: ' + names[i - 1]);
                }).catch((error) => {
                    console.log('Error inside of updating Lowest Score for: ' + names[i - 1] + error)
                });
            }
       }
    }

    static async updateMargins (boxscores) {

        for(var i = 1; i < 9; i++) {

            var currentTeam =  _.find(boxscores, function(o) {return o.hostId === i}); // API data for week
            const memberTeam = await Members.findOne({ team_id: i}); // DB info


            if(currentTeam.win === 1) {

                if(currentTeam.margin > memberTeam.biggestWinMargin.margin) {

                    Members.updateOne({'team_id': i}, {'biggestWinMargin.margin': currentTeam.margin, 'biggestWinMargin.week': currentTeam.week, 'biggestWinMargin.season': currentTeam.season, 'biggestWinMargin.oppName': names[currentTeam.oppID] }).then((data) => {
                        console.log('updated Biggest Win Margin for: ' + names[i - 1]);
                    }).catch((error) => {
                        console.log('Error inside of Biggest Win Margin for: ' + names[i - 1] + error)
                    });
                }
                if(currentTeam.margin < memberTeam.lowestWinMargin.margin) {

                    Members.updateOne({'team_id': i}, {'lowestWinMargin.margin': currentTeam.margin, 'lowestWinMargin.week': currentTeam.week, 'lowestWinMargin.season': currentTeam.season, 'lowestWinMargin.oppName': names[currentTeam.oppID] }).then((data) => {
                        console.log('updated Lowest Win Margin for: ' + names[i - 1]);
                    }).catch((error) => {
                        console.log('Error inside of updating Lowest Win Margin for: ' + names[i - 1] + error)
                    });
                }
            }

            if(currentTeam.loss === 1) {

                 if(currentTeam.margin > memberTeam.biggestLossMargin.margin) {

                    Members.updateOne({'team_id': i}, {'biggestLossMargin.margin': currentTeam.margin, 'biggestLossMargin.week': currentTeam.week, 'biggestLossMargin.season': currentTeam.season, 'biggestLossMargin.oppName': names[currentTeam.oppID] }).then((data) => {
                        console.log('updated Biggest Loss Margin for: ' + names[i - 1]);
                    }).catch((error) => {
                        console.log('Error inside of Biggest Loss Margin for: ' + names[i - 1] + error)
                    });
                }
                if(currentTeam.margin < memberTeam.lowestLossMargin.margin) {

                    Members.updateOne({'team_id': i}, {'lowestLossMargin.margin': currentTeam.margin, 'lowestLossMargin.week': currentTeam.week, 'lowestLossMargin.season': currentTeam.season, 'lowestLossMargin.oppName': names[currentTeam.oppID] }).then((data) => {
                        console.log('updated Lowest Loss Margin for: ' + names[i - 1]);
                    }).catch((error) => {
                        console.log('Error inside of updating Lowest Loss Margin for: ' + names[i - 1] + error)
                    });
                }

                // updates losses within 10
                if(currentTeam.margin > 5 && currentTeam.margin < 10) {
                     const losses = memberTeam.lossesWithinTen + currentTeam.loss;
 
                    Members.updateOne({'team_id': i}, {'lossesWithinTen': losses}).then((data) => {
                        console.log('updated Losses Within 10 for: ' + names[i - 1]);
                    }).catch((error) => {
                        console.log('Error inside of updating Losses Within 10 for: ' + names[i - 1] + error)
                    });
                }

                // updates losses within 5
                if(currentTeam.margin < 5) {
                    const losses = memberTeam.lossesWithinFive + currentTeam.loss;

                   Members.updateOne({'team_id': i}, {'lossesWithinFive': losses}).then((data) => {
                       console.log('updated Losses Within 5 for: ' + names[i - 1]);
                   }).catch((error) => {
                       console.log('Error inside of updating Losses Within 5 for: ' + names[i - 1] + error)
                   });
               }
            }
        }

    }

    static async updateMVP (boxscores) {

        for(var i = 1; i < 9; i ++) {

            var currentTeam =  _.find(boxscores, function(o) {return o.hostId === i}); // API data for week
            const memberTeam = await Members.findOne({ team_id: i}); // DB info
            const weekMVP = this.getMVPforWeek(currentTeam.hostRoster);

            if(weekMVP.startingMVP.totalPoints > memberTeam.MVP.points){

                Members.updateOne({'team_id': i}, {'MVP.fullName': weekMVP.startingMVP.name, 'MVP.points': weekMVP.startingMVP.totalPoints, 'MVP.position': weekMVP.startingMVP.position, 'MVP.week': currentTeam.week, 'MVP.season': currentTeam.season, 'MVP.oppName': names[currentTeam.oppID] }).then((data) => {
                    console.log('updated MVP for: ' + names[i - 1]);
                }).catch((error) => {
                    console.log('Error inside of MVP for: ' + names[i - 1] + error)
                });
            }
        }
    }

    static getMVPforWeek (roster) {

        let team = [];

        _.forEach(roster, (athlete) => {
            let player = {};
            player.name = athlete.player.fullName;
            player.position = athlete.position;
            player.totalPoints = Math.round((athlete.totalPoints)*100)/100;
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


module.exports.updateWeeklyRecords = updateWeeklyRecords;