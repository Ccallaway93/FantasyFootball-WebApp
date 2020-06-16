const _ = require('lodash');
const express = require('express')
const router = express.Router();
const {Standings} = require('../standings');
const {Seed} = require('../seed');
const Member = require('../models/member');
const Keeper = require('../models/keeper');
const TeamRecords = require('../models/teamRecords')



router.get('/member/kevin', (req,res) => {
    let person = [];
    Member.findOne({team_id: 1}).then((general) => {

        Keeper.find({teamId: 1, active: true}).then((keepers) => {

            TeamRecords.find({team_id: 1}).then((records) => {
                person.general = general;
                person.keepers = keepers;
                person.records = records;
                console.log(person)
                res.render('member', person)
            })
        })
    })
})

router.get('/member/duncan', (req,res) => {
    let person = [];
    Member.findOne({team_id: 2}).then((general) => {

        Keeper.find({teamId: 2, active: true}).then((keepers) => {

            TeamRecords.find({team_id: 2}).then((records) => {
                person.general = general;
                person.keepers = keepers;
                person.records = records;
                res.render('member', person)
            })
        })
    })
})

router.get('/member/matt', (req,res) => {
    let person = [];
    Member.findOne({team_id: 3}).then((general) => {

        Keeper.find({teamId: 3, active: true}).then((keepers) => {

            TeamRecords.find({team_id: 3}).then((records) => {
                person.general = general;
                person.keepers = keepers;
                person.records = records;
                console.log(person);
                res.render('member', person)
            })
        })
    })
})

router.get('/member/nick', (req,res) => {
    let person = [];
    Member.findOne({team_id: 4}).then((general) => {

        Keeper.find({teamId: 4, active: true}).then((keepers) => {

            TeamRecords.find({team_id: 4}).then((records) => {
                person.general = general;
                person.keepers = keepers;
                person.records = records;
                res.render('member', person)
            })
        })
    })
})

router.get('/member/conner', (req,res) => {
    let person = [];
    Member.findOne({team_id: 5}).then((general) => {

        Keeper.find({teamId: 5, active: true}).then((keepers) => {

            TeamRecords.find({team_id: 5}).then((records) => {
                person.general = general;
                person.keepers = keepers;
                person.records = records;
                res.render('member', person)
            })
        })
    })
})

router.get('/member/morgan', (req,res) => {
    let person = [];
    Member.findOne({team_id: 6}).then((general) => {

        Keeper.find({teamId: 6, active: true}).then((keepers) => {

            TeamRecords.find({team_id: 6}).then((records) => {
                person.general = general;
                person.keepers = keepers;
                person.records = records;
                console.log(person)
                res.render('member', person)
            })
        })
    })
})

router.get('/member/seth', (req,res) => {
    let person = [];
    Member.findOne({team_id: 7}).then((general) => {

        Keeper.find({teamId: 7, active: true}).then((keepers) => {

            TeamRecords.find({team_id: 7}).then((records) => {
                person.general = general;
                person.keepers = keepers;
                person.records = records;
                res.render('member', person)
            })
        })
    })
})

router.get('/member/erik', (req,res) => {
    let person = [];
    Member.findOne({team_id: 8}).then((general) => {

        Keeper.find({teamId: 8, active: true}).then((keepers) => {

            TeamRecords.find({team_id: 8}).then((records) => {
                person.general = general;
                person.keepers = keepers;
                person.records = records;
                res.render('member', person)
            })
        })
    })
})




module.exports = router;