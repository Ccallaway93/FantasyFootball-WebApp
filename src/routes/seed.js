const _ = require('lodash');
const express = require('express')
const router = express.Router();
const {Historical} = require('../historical')
const {Seed} = require('../seed')
const {HeadToHead} = require('../headTohead')
const TotalPoints = require('../models/totalPoints')
const TeamRecords = require('../models/teamRecords')




router.get('/seed', (req, res) => {


})


module.exports = router;