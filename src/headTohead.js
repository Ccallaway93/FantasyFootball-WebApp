const _ = require('lodash');
const {Client} = require('espn-fantasy-football-api/node')
const myClient = new Client({leagueId:606204})
var mongoose = require('mongoose')
const TeamRecords = require('./models/teamRecords')

const SWID = 'A67BC139-899E-4769-A7A6-3ECC1C4C6CEA'
const espnS2 = 'AEAWzRoDdGCLxD1XZeznDjkrKWc1GGcFI9s%2FoXSAit%2BL6Ml3JdAaAAV0M4Vdl1cbm62K8uMrbBtXGJmu4lyenrnmAcDM2Lv7fEzIwmKqafOSID0YTpkcQ2dcgm8R1kWQuwTUvNcSvjL9c80gv8GwCkXpItl7wwaAauOsV8AR6xw79amYGOXZVKIubOmLidSQnh3FzDuvIBoAMa1B0RwNP%2BJwis7drFgcoYkmlrWNrcz4gc3AbVkTU9Roq%2BZ%2FsMfedirA6qvcG1ZQQhFRB1e4vI5S'
myClient.setCookies({SWID,espnS2})

const names = ['','Kevin', 'Duncan', 'Matt', 'Nick', 'Conner', 'Morgan', 'Seth', 'Erik']

class HeadToHead {

    static getTotalHeadToHead() {

        TeamRecords.find({'year': 2018}).then((data) => {
             
            _.forEach(data, (team) => {

                



            })

        })


    }

    






}

module.exports.HeadToHead = HeadToHead