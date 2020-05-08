const _ = require('lodash');
const express = require('express')
const router = express.Router();
const {Historical} = require('../historical')
const TotalPoints = require('../models/totalPoints')
const TeamRecords = require('../models/teamRecords')
// const TeamRecords = require('../models/teamRecords')
// const NoteWorthyGames = require('../models/noteWorthyGames')
// const HotTake = require('../models/hotTakes')



// router.get('/history', (req,res) => {
//     TotalPoints.find({}).then((data) => {
//         const test = _.sortBy(data, o => o.team_id)
//         console.log(test);
//         res.render('history', _.sortBy(data, o => o.team_id))
//     }).catch((error) => {
//         console.log(error)
//     })
// })

router.get('/history', (req, res) => {
    Historical.getAllHistoricalData().then((data) => {
        console.log(data);        
        res.render('history', data);
    }).catch((error) => {
        console.log(error)
    })
})






// router.get('', (req, res) => {
//     res.render('index', {
//         title: 'Weather',
//         name: 'Andrew Mead'
//     })
// })


module.exports = router;