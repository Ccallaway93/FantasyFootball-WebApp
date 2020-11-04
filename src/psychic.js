const _ = require('lodash');
const {Client} = require('espn-fantasy-football-api/node')

const myClient = new Client({leagueId:606204});

const SWID = 'A67BC139-899E-4769-A7A6-3ECC1C4C6CEA'
const espnS2 = 'AEAWzRoDdGCLxD1XZeznDjkrKWc1GGcFI9s%2FoXSAit%2BL6Ml3JdAaAAV0M4Vdl1cbm62K8uMrbBtXGJmu4lyenrnmAcDM2Lv7fEzIwmKqafOSID0YTpkcQ2dcgm8R1kWQuwTUvNcSvjL9c80gv8GwCkXpItl7wwaAauOsV8AR6xw79amYGOXZVKIubOmLidSQnh3FzDuvIBoAMa1B0RwNP%2BJwis7drFgcoYkmlrWNrcz4gc3AbVkTU9Roq%2BZ%2FsMfedirA6qvcG1ZQQhFRB1e4vI5S'

myClient.setCookies({SWID,espnS2})


class Psychic { 

  static test() {
    myClient.getLeagueInfo(2020).then((data) => {
      console.log(data);
    })
  }

  static filterPosition(boxscorePlayer, position) {
    return (
      boxscorePlayer.position === position ||
      _.includes(boxscorePlayer.player.eligiblePositions, position)
    );
  }


  static handleNonFlexPosition(lineup, position) {
    const players = _.filter(lineup, (player) => this.filterPosition(player, position));
    const sortedPlayers = _.sortBy(players, ['totalPoints']);
    return _.last(sortedPlayers);
  }

  static analyzeLineup(lineup, score) {
    let bestSum = 0;
    const bestRoster = [];
    let numChanges = 0;
    const bestQB = this.handleNonFlexPosition(lineup, 'QB')
    bestRoster.push(bestQB.player.fullName);
    bestSum += bestQB.totalPoints;
    if (bestQB.position === 'Bench') {
      numChanges += 1;
    }

    const bestDefense = this.handleNonFlexPosition(lineup, 'D/ST')
    bestRoster.push(bestDefense.player.fullName);
    bestSum += bestDefense.totalPoints;
    if (bestDefense.position === 'Bench') {
      numChanges += 1;
    }

    
    // const bestKicker = this.handleNonFlexPosition(lineup, 'K')
    // bestRoster.push(bestKicker.player.fullName);
    // bestSum += bestKicker.totalPoints;
    // if (bestKicker.position === 'Bench') {
    //   numChanges += 1;
    // }

    const flexPlayers = _.filter(lineup, (player) => this.filterPosition(player, 'RB') ||
      this.filterPosition(player, 'WR') ||
      this.filterPosition(player, 'TE')
    );

    const sortedFlexPlayers = _.sortBy(flexPlayers, ['totalPoints']);

    const flexPos = { RB: 2, WR: 2, TE: 1, FLEX: 2 };


    while (_.sum(_.values(flexPos)) && !_.isEmpty(sortedFlexPlayers)) {
      const player = sortedFlexPlayers.pop();
      const acceptPlayer = () => {
        bestRoster.push(player.player.fullName);
        bestSum += player.totalPoints;
        if (player.position === 'Bench') {
          numChanges += 1;
        }
      }

      if (flexPos.RB && _.includes(player.player.eligiblePositions, 'RB')) {
        acceptPlayer();
        flexPos.RB -= 1;
      } else if (flexPos.WR && _.includes(player.player.eligiblePositions, 'WR')) {
        acceptPlayer();
        flexPos.WR -= 1;
      } else if (flexPos.TE && _.includes(player.player.eligiblePositions, 'TE')) {
        acceptPlayer();
        flexPos.TE -= 1;
      } else if (flexPos.FLEX) {
        acceptPlayer();
        flexPos.FLEX -= 1;
      }
    }

    return {
      bestSum,
      bestRoster,
      currentScore: score,
      numChanges
    };
  }

   static runForWeek({ seasonId, matchupPeriodId, scoringPeriodId }) {
    const bestLineups = {};
    //console.log('seasonId:' + seasonId + ' matchupPeriodId: ' + matchupPeriodId + ' scoringPeriodId: ' +scoringPeriodId)
    return myClient.getBoxscoreForWeek({ seasonId, matchupPeriodId, scoringPeriodId }).then((boxes) => {
      _.forEach(boxes, (box) => {
        bestLineups[box.awayTeamId] = this.analyzeLineup(box.awayRoster, box.awayScore);
        bestLineups[box.homeTeamId] = this.analyzeLineup(box.homeRoster, box.homeScore);
      });
      return bestLineups;
    });
  }
 
}

module.exports.Psychic = Psychic

// Psychic.runForWeek({ seasonId: 2020, matchupPeriodId: 1, scoringPeriodId: 1 }).then((result) => {
//   console.log(result);
//   return result;
// });






