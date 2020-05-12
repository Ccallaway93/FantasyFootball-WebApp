const _ = require('lodash');
const express = require('express')
const router = express.Router();
const {Historical} = require('../historical')
const TotalPoints = require('../models/totalPoints')
const TeamRecords = require('../models/teamRecords')


router.get('/headTohead', (req, res) => {

    TeamRecords.find({'year': 'Total', 'name': 'Erik'}).then((data) => {
        res.render('headTohead',data);
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


     return Promise.all(total).then((results) => {
         const data = {
             left: results[0],
             right: results[1],
         };
         res.send(data);
     }).catch((e) => {
         console.log(e)
     })

})





module.exports = router;