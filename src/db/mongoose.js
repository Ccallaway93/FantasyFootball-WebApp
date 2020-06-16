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


mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
});






