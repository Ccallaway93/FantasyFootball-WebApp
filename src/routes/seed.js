const _ = require('lodash');
const express = require('express')
const router = express.Router();
const multer        = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid          = require('gridfs-stream');
const path          = require('path') 
const crypto = require('crypto');

const {Historical} = require('../historical')
const {updateWeeklyRecords} = require('../updateWeeklyRecords');
const {Seed} = require('../seed')
const {mongo} = require('../db/mongoose');
//const {HeadToHead} = require('../test')
const TotalPoints = require('../models/totalPoints')
const TeamRecords = require('../models/teamRecords');
const { updateYearlyRecords } = require('../updateYearlyRecords');

const storage = new GridFsStorage({
    url: process.env.MONGODB_URL,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err)
                }
                //const filename = buf.toString('hex') + path.extname(file.originalname);
                const fileInfo = {
                    filename: file.originalname,
                    bucketName: 'uploads'
                };
                resolve(fileInfo)
            });
        });
    }
});

const upload = multer({storage});

router.get('/seed', (req, res) => {

    
    //updateWeeklyRecords.update(2020,5,5);
    updateYearlyRecords.runForStartOfSeason(2020, 1, 1);

        res.render('seed');


})





router.post('/seed', upload.single('file'), (req, res) => {

    res.json({file: req.file});
    //Seed.UpdateTotalHeadToHeadDB(8);
    //Seed.getTotalHeadToHeadPerSeason(1,2019,3);

})


module.exports = router;