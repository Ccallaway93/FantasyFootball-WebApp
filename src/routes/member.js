const _ = require('lodash');
const express = require('express')
const router = express.Router();
const {Standings} = require('../standings');
const {Seed} = require('../seed');
const {Member} = require('../member');


router.get('/member', (req,res) => {

    //  Member.allAPIData(1, 2018).then((data) => {
    //     console.log(data);
    // })

    //Member.test(1);
    Member.updateMemberDB(8);
    //console.log(test);

    // Seed.getMatchupData(1,1,1,2018).then((data) => {
    //     //console.log(data)
    // })

})




module.exports = router;