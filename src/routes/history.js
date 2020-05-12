const _ = require('lodash');
const express = require('express')
const router = express.Router();
const {Historical} = require('../historical')
const TotalPoints = require('../models/totalPoints')
const TeamRecords = require('../models/teamRecords')


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