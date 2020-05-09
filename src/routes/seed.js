const _ = require('lodash');
const express = require('express')
const router = express.Router();
const {Historical} = require('../historical')
const {Seed} = require('../seed')
const TotalPoints = require('../models/totalPoints')
const TeamRecords = require('../models/teamRecords')



router.get('/seed', (req, res) => {

    Seed.updateDbHeadtoHeadPerTeam(1, 2018);

})


module.exports = router;