const _ = require('lodash');
const express = require('express')
const router = express.Router();
const {Historical} = require('../historical')
const {Seed} = require('../seed')
const {HeadToHead} = require('../headTohead')
const TotalPoints = require('../models/totalPoints')
const TeamRecords = require('../models/teamRecords')




router.get('/seed', (req, res) => {

    //Seed.UpdateTotalHeadToHeadDB(8);
    //Seed.getTotalHeadToHeadPerSeason(1,2019,3);

})


module.exports = router;