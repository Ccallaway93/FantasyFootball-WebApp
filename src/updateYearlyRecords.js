const _ = require('lodash');
const {Client} = require('espn-fantasy-football-api/node')
const myClient = new Client({leagueId:606204})
var mongoose = require('mongoose')
const TeamRecords = require('./models/teamRecords')
const TotalPoints = require('./models/totalPoints')
const Records = require('./models/record')
const Members = require('./models/member')
const {Member} = require('./member');

//  Config for connecting to a private league
// const SWID = process.env.SWID
// const espnS2 = process.env.ESPNS2

// console.log(SWID)
// console.log(espnS2)

 const SWID = 'A67BC139-899E-4769-A7A6-3ECC1C4C6CEA'
 const espnS2 = 'AEAWzRoDdGCLxD1XZeznDjkrKWc1GGcFI9s%2FoXSAit%2BL6Ml3JdAaAAV0M4Vdl1cbm62K8uMrbBtXGJmu4lyenrnmAcDM2Lv7fEzIwmKqafOSID0YTpkcQ2dcgm8R1kWQuwTUvNcSvjL9c80gv8GwCkXpItl7wwaAauOsV8AR6xw79amYGOXZVKIubOmLidSQnh3FzDuvIBoAMa1B0RwNP%2BJwis7drFgcoYkmlrWNrcz4gc3AbVkTU9Roq%2BZ%2FsMfedirA6qvcG1ZQQhFRB1e4vI5S'
myClient.setCookies({SWID,espnS2})
const names = ['','Kevin', 'Duncan', 'Matt', 'Nick', 'Conner', 'Morgan', 'Seth', 'Erik']



class updateYearlyRecords {


    static runForStartOfSeason(seasonId, scoringPeriodId, matchupPeriodId) {

        myClient.getTeamsAtWeek({seasonId, scoringPeriodId: 1}).then((teams) => {

            //this.createNewRecords(seasonId);
            //this.createNewSeason(seasonId, teams);

        })
    }

    static async createNewRecords(seasonId){

        for(var i = 1; i < 9; i++){

            await TeamRecords.create({'team_id': i, 'name': names[i], 'year': seasonId, 'wins': 0, 'losses': 0, 'winPercentage': 0, 'moves': 0, 'finalStanding': 0, 'playoffs': false})
            console.log('Created new Team Record object for: ' +names[i]);

            await TotalPoints.create({'team_id': i, 'name': names[i], 'year': seasonId, 'pointsFor': 0, 'pointsAgainst': 0, 'difference': 0})
            console.log('Created new Total Points object for: ' +names[i]);
        }

    }

    static async createNewSeason(seasonId, teams){

        var today = new Date();
        var date = (today.getMonth()+1)+'-'+today.getDate()+'-'+today.getFullYear();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date+' '+time;

        for(var i = 1; i < 9; i++){

            console.log(i);
            var team = _.find(teams, function(team) {return team.id == i});
            
            var newSeason = {
                seasonId: seasonId,
                teamName: team.name,
                personalDraftGrade: 'A+',
                leagueDraftGrade: 'A',
                draftRoster: await this.getFullRosters(i, 1, seasonId),
                playoffRoster: []
            };

            await Members.updateOne({'team_id': i}, {$push: {'seasons': newSeason}, 'lastUpdated':dateTime}).then((data) => {
                console.log('Created new Season in Members for: ' + names[i])
            }).catch((error) => {
                console.log('Error inside of creating a new season in Members for: ' + names[i] + error)
            });
        }
    }


    static async getFullRosters(teamId, week, year){
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





module.exports.updateYearlyRecords = updateYearlyRecords;