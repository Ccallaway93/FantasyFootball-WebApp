const _ = require('lodash');
const express = require('express')
const router = express.Router();
const {Standings} = require('../standings');


router.get('/standings', (req,res) => {

    Standings.getRegularSeasonStandings().then((teams) => {
        console.log(teams);
        res.render('standings', _.sortBy(teams, o => o.wins));
    }).catch((error) => {
        console.log(error)
    })

})




module.exports = router;