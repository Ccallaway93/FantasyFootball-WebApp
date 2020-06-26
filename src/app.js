//  libraries
const path          = require('path')    // This is a core NODE module that allows for string manipulation on the directory/file paths
const express       = require('express')
const hbs           = require('hbs')
const bodyParser    = require('body-parser');
const moment        = require('moment');
const multer        = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid      = require('gridfs-stream');
const mongoose = require('mongoose');

//const seedDB      = require('./seeds')
                      require('./db/mongoose')
const HistoryRouter = require('./routes/history')
const StandingsRouter = require('./routes/standings')
const SeedRouter = require('./routes/seed')
const HeadToHeadRouter = require('./routes/headTohead')
const MemberRouter = require('./routes/member')
const HotTakeRouter = require('./routes/hotTakes')

const {mongo} = require('./db/mongoose');


const app = express()

app.use(express.json())

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))


console.log('directory ' + __dirname)  // Path to directory the current script lives in
console.log(__filename) // This provides the path to the file itself


// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../public/templates/views')
const partialsPath = path.join(__dirname, '../public/templates/partials')


// Setup handlebars engine and views location
// This redners dynamic web pages
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

//  This helper is used to sort through specific array with the name of the year.
hbs.registerHelper('equal', function(lvalue, rvalue, options) {
    if (arguments.length < 3)
        throw new Error("Handlebars Helper equal needs 2 parameters");
    if( lvalue!=rvalue ) {
        return options.inverse(this);
    } else {
        return options.fn(this);
    }
  });

hbs.registerHelper("img", function(source) {
    var src = hbs.escapeExpression(source);
    console.log(src)
        //<img src="" alt="">
        
   return new hbs.SafeString("<img src='" + src + "'>");
});

hbs.registerHelper("debug", function(optionalValue) {
    console.log("Current Context");
    console.log("====================");
    console.log(this);
    if (optionalValue) {
        console.log("Value");
        console.log("====================");
        console.log(optionalValue);
    }
});

// Setup static directory to serve
// This means that the assets do not change!
app.use(express.static(publicDirectoryPath))
app.use(HistoryRouter)
app.use(StandingsRouter)
app.use(SeedRouter)
app.use(HeadToHeadRouter)
app.use(MemberRouter)
app.use(HotTakeRouter)

app.get('', (req,res) => {
    res.render('index')
})

app.get('/about', (req,res) => {
    res.render('about')
})





//  This is set in the env variables under the Config Folder
const port = process.env.PORT


app.listen(port, () => {
    console.log('Server is up on port ' + port)
})
