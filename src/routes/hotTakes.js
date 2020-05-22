const _ = require('lodash');
const express = require('express')
const router = express.Router();
const {Standings} = require('../standings');
const HotTakes = require('../models/hotTake');


router.get('/hotTakes', (req,res) => {

    HotTakes.find({}).then((data) => {
        console.log(data)
        res.render('hotTakes', data)
    }).catch((error) => {
        console.log(error)
    })

})

module.exports = router;