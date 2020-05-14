const _             = require('lodash');
const {Client}      = require('espn-fantasy-football-api/node')
const myClient      = new Client({leagueId:606204})
var mongoose        = require('mongoose')
const TeamRecords   = require('./models/teamRecords')
const TotalPoints   = require('./models/totalPoints')
const Records       = require('./models/record')
const MemberModel   = require('./models/member')
const {Seed}        = require('./seed');
const {Historical}  = require('./historical')
const {Standings}   = require('./standings')

const SWID = 'A67BC139-899E-4769-A7A6-3ECC1C4C6CEA'
const espnS2 = 'AEAWzRoDdGCLxD1XZeznDjkrKWc1GGcFI9s%2FoXSAit%2BL6Ml3JdAaAAV0M4Vdl1cbm62K8uMrbBtXGJmu4lyenrnmAcDM2Lv7fEzIwmKqafOSID0YTpkcQ2dcgm8R1kWQuwTUvNcSvjL9c80gv8GwCkXpItl7wwaAauOsV8AR6xw79amYGOXZVKIubOmLidSQnh3FzDuvIBoAMa1B0RwNP%2BJwis7drFgcoYkmlrWNrcz4gc3AbVkTU9Roq%2BZ%2FsMfedirA6qvcG1ZQQhFRB1e4vI5S'
myClient.setCookies({SWID,espnS2})

let team = new MemberModel({});


class Member {


    static updateMemberDB(teamId) {

        this.WTF(teamId).then((data) => {

            MemberModel.create(data, (error, data) => {
                if(error){
                    console.log(error)
                }
                else{
                    console.log('Added member')
                }
            })
        })

    }




    static WTF(teamId) {


        return this.allAPIData(teamId, 2018).then((team) => {

            return this.getFullRosters(1,1,2018).then((year2018) => {
                
                return this.getFullRosters(1,13,2018).then((year20182) => {

                    return this.getFullRosters(1,1,2019).then((year2019) => {

                        return this.getFullRosters(1,13,2019).then((year20192) => {

                              team.seasons = [
                                year = {
                                    seasonId: 2018,
                                    teamName: 'Test',
                                    draftRoster: year2018,
                                    playoffRoster: year20182,
                                },
                                year = {
                                    seasonId: 2019,
                                    teamName: 'Test2',
                                    draftRoster: year2019,
                                    playoffRoster: year20192
                                }
                            ]

                            return team;

                        })

                    })

                })

            })

        })
    }














    static allAPIData(teamId, year) {

        Standings.addTeamTotalsObject(teamId).then((data) => {
             team = {
                team_id: data.id,
                name: data.name,
                active: true,
                wins: data.wins,
                losses: data.losses,
                moves: data.moves,
                winPercentage: data.percentage,
                championships: data.championships,
                years: data.years,
                averageFinish: data.averageFinish,
                playoffWins: 0,
                playoffLosses: 0
            };
        })

        TotalPoints.find({'team_id': teamId}).then((data) => {
            let pointsFor = 0
            let pointsAgainst = 0

            _.forEach(data, (year) => {
                pointsFor += year.pointsFor;
                pointsAgainst += year.pointsAgainst;
            })
            
            team.totalPoints = pointsFor;
            team.totalPointsAgainst = pointsAgainst;
            team.different = Math.round((pointsFor - pointsAgainst) * 100)/100;
            team.averagePoints = Math.round((pointsFor/24) * 100)/100;
            team.averagePointsAgainst = Math.round((pointsAgainst/24) * 100)/100;
        })

        return TeamRecords.find({'team_id':teamId}).then((years) => {
            let championshipAppearances = 0;
            let playoffAppearances = 0;
            let lastPlaceFinishes = 0;
            let games = [];
            let mvp = {};

            _.forEach(years, (year)=> {
                if(year.playoffs === true){
                    playoffAppearances++
                }
                if(year.finalStanding <= 2){
                    championshipAppearances++
                }
                if(year.finalStanding === 8){
                    lastPlaceFinishes++
                }              
            })

            for(var i = 1; i < years.length; i++){

                if(years[i].year != 'Total'){

                    _.forEach(years[i].h2h, (game) => {
                        games.push(game)
                    })

                }
            }


            var wins = _.filter(games, function(o) {return o.win === true})
            var losses = _.filter(games, function(o) {return o.win === false})

            var highestScoreObj = games.reduce(function(prev, current) {return (prev.hostScore > current.hostScore) ? prev : current});
            var lowestScoreObj = games.reduce(function(prev, current) {return (prev.hostScore < current.hostScore) ? prev : current});

            var bestPerformer = games.reduce(function(prev, current) {return (prev.hostStartingMVPScore > current.hostStartingMVPScore) ? prev : current});

            var bestWinMargin = wins.reduce(function(prev, current) {return (prev.margin > current.margin) ? prev : current});
            var lowestWinMargin = wins.reduce(function(prev, current) {return (prev.margin < current.margin) ? prev : current});

            var bestLossMargin = losses.reduce(function(prev, current) {return (prev.margin > current.margin) ? prev : current});
            var lowestLossMargin = losses.reduce(function(prev, current) {return (prev.margin < current.margin) ? prev : current});

            team.championshipAppearances = championshipAppearances;
            team.playoffAppearances = playoffAppearances;
            team.lastPlaceFinishes = lastPlaceFinishes;
            team.highestScore = {score: highestScoreObj.hostScore, week: highestScoreObj.scoringPeriodId, oppName: highestScoreObj.oppName, season: highestScoreObj.seasonId }
            team.lowestScore = {score: lowestScoreObj.hostScore, week: lowestScoreObj.scoringPeriodId, oppName: lowestScoreObj.oppName, season: lowestScoreObj.seasonId }
            team.biggestWinMargin = {margin: bestWinMargin.margin, week: bestWinMargin.scoringPeriodId, oppName: bestWinMargin.oppName, season: bestWinMargin.seasonId }
            team.lowestWinMargin = {margin: lowestWinMargin.margin, week: lowestWinMargin.scoringPeriodId, oppName: lowestWinMargin.oppName, season: lowestWinMargin.seasonId }
            team.biggestLossMargin = {margin: bestLossMargin.margin, week: bestLossMargin.scoringPeriodId, oppName: bestLossMargin.oppName, season: bestLossMargin.seasonId }
            team.lowestLossMargin = {margin: lowestLossMargin.margin, week: lowestLossMargin.scoringPeriodId, oppName: lowestLossMargin.oppName, season: lowestLossMargin.seasonId }


            team.MVP = {fullName: bestPerformer.hostStartingMVP, points: bestPerformer.hostStartingMVPScore, position: bestPerformer.hostStartingMVPPosition, week: bestPerformer.scoringPeriodId, season: bestPerformer.seasonId, oppName: bestPerformer.oppName, keeper: false}

            return team;

            // let firstRoster1 = []
            // let endRoster1 = []
            // let firstRoster2 = []
            // let endRoster2 = []
            // let test = []

            // endRoster1 = this.getFullRosters(teamId, 13, 2018);
            // firstRoster1 = this.getFullRosters(teamId,1,2018);

            // endRoster2 = this.getFullRosters(teamId, 13, 2019);
            // firstRoster2 = this.getFullRosters(teamId,1,2019);

            // test = [
            //     year = {
            //         seasonId: 2018,
            //         teamName: 'Test',
            //         draftRoster:firstRoster1,
            //         playoffRoster:endRoster1

            //     },
            //     year = {
            //         seasonId:2019,
            //         teamName: 'Test2',
            //         draftRoster:firstRoster2,
            //         playoffRoster:endRoster2
            //     }
            // ]

            // return Promise.all(test).then((results) => {

            //     team.seasons = results;
            //     console.log(team);
            //     return team;
            // }).catch((e) => {
            //     console.log(e)
            // })

            // this.getFullRosters(teamId, 1, 2018).then((data) => {
                
            //     firstRoster = data;

            //      this.getFullRosters(teamId, 13, 2018).then((data) => {
            //         endRoster = data;

            //          team.seasons = [
            //              year = {
            //                  seasonId: 2018,
            //                  teamName: 'test',
            //                  draftRoster: firstRoster,
            //                  playoffRoster: endRoster
            //              }
            //          ]
            //     })
                
            // })


            // this.getFullRosters(teamId, 1, 2019).then((data) => {
                
            //     firstRoster = data;

            //      this.getFullRosters(teamId, 13, 2019).then((data) => {
            //         endRoster = data;

            //          team.seasons = [
            //              year = {
            //                  seasonId: 2019,
            //                  teamName: 'test',
            //                  draftRoster: firstRoster,
            //                  playoffRoster: endRoster
            //              }
            //          ]

            //     })
                
            // })



        })


    }

    static getFullRosters(teamId, week, year){
        let fixedRoster = [];

         return myClient.getTeamsAtWeek({seasonId: year, scoringPeriodId: week}).then((data) => {
                
            var teams = _.filter(data, function(o) {return o.id === teamId})
            var roster = teams[0].roster;



            _.forEach(roster, (player) => {

                let obj = {}

                obj = {
                    fullName: player.fullName,
                    position: player.defaultPosition,
                    proTeam: player.proTeam,
                    proTeamAbbreviation: player.proTeamAbbreviation,
                    keeper: false,
                    keeperElgibility: 0
                }
                fixedRoster.push(obj);

            })
            return fixedRoster;
        })
        

    }








}



module.exports.Member = Member