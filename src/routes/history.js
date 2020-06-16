const _ = require('lodash');
const express = require('express')
const router = express.Router();
const {Historical} = require('../historical')
const TotalPoints = require('../models/totalPoints')
const TeamRecords = require('../models/teamRecords')

const mongoose = require('mongoose');
const multer        = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid          = require('gridfs-stream');
const path          = require('path') 

let gfs;

var conn = mongoose.createConnection(process.env.MONGODB_URL);

conn.once('open',  () => {
    //  Init stream
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads');
});


//  var getTeamImage = function (teamId) {
//      gfs.files.findOne({ teamId: teamId }, (err, file) => {
//           console.log(file);
//           return file.filename;
//     });
    
// }


router.get('/history', (req, res) => {
    Historical.getAllHistoricalData().then((data) => {
        console.log(data);        
        res.render('history', data);
    }).catch((error) => {
        console.log(error)
    })
})


router.get('/history/image', (req, res) => {
    gfs.files.findOne({ teamId: 1 }, (err, file) => {
        // Check if file
        if (!file || file.length === 0) {
          return res.status(404).json({
            err: 'No file exists'
          });
        }
    
        // Check if image
        if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
          // Read output to browser
          const readstream = gfs.createReadStream(file.filename);
          readstream.pipe(res);
        } else {
          res.status(404).json({
            err: 'Not an image'
          });
        }
      });
})





// router.get('', (req, res) => {
//     res.render('index', {
//         title: 'Weather',
//         name: 'Andrew Mead'
//     })
// })


module.exports = router;