const _ = require('lodash');
const express = require('express')
const router = express.Router();
const {Historical} = require('../historical')
const TotalPoints = require('../models/totalPoints')
const TeamRecords = require('../models/teamRecords')


router.get('/headTohead', (req, res) => {

    TeamRecords.find({'year': 'Total', 'name': 'Erik'}).then((data) => {
        console.log(data);
        res.render('headTohead',data);
    })

})

router.post('/headTohead', (req, res) => {
    console.log(req.body);
})





module.exports = router;