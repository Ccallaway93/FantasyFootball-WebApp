const _ = require('lodash');
const express = require('express')
const router = express.Router();
const {Standings} = require('../standings');
const {Seed} = require('../seed');
const Member = require('../models/member');



router.get('/kevin', (req,res) => {

    Member.findOne({team_id: 1}).then((data) => {
        console.log(data)
        res.render('kevin',data);
    })

})




module.exports = router;