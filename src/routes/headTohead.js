const _ = require('lodash');
const express = require('express')
const router = express.Router();
const {Historical} = require('../historical')
const TotalPoints = require('../models/totalPoints')
const TeamRecords = require('../models/teamRecords')


router.get('/headToHead', (req, res) => {


    TeamRecords.find({'year': 'Total', 'name': 'Erik'}).then((data) => {
        console.log(data);
        res.render('headToHead',data);
    })

})

router.post('/headTohead', (req, res) => {
     let total = []

    const left = TeamRecords.find({'year': 'Total', 'team_id': req.body.leftId}).then((data) => {
        let Lefttotal = data[0].h2h;
        return _.find(Lefttotal, {'oppId': parseInt(req.body.rightId)});
    })
     total.push(left);

     const right = TeamRecords.find({'year': 'Total', 'team_id': req.body.rightId}).then((data) => {
        let RightTotal = data[0].h2h;
        return _.find(RightTotal, {'oppId': parseInt(req.body.leftId)});
    })
     total.push(right)


        const record = TeamRecords.find({'team_id': req.body.leftId}).then((data) => {
        let matchups = _.filter(data, function(o) {return o.year !== 'Total' && o.year !== '2017'})
        let games = [];

        for(var i = 0; i < matchups.length; i++) {
            _.forEach(matchups[i].h2h, (game) => {
                //console.log(game);
                if(game.oppId === parseInt(req.body.rightId)){
                    games.push(game);
                }
            })
        }
        return games
     })
     total.push(record);





     return Promise.all(total).then((results) => {
         const data = {
             left: results[0],
             right: results[1],
             games: results[2]
         };
         res.send(data);
     }).catch((e) => {
         console.log(e)
     })

})





module.exports = router;