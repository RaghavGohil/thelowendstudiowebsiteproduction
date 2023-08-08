const dotenv = require('dotenv')
const express = require('express')
const {engine} = require('express-handlebars')
const favicon = require('serve-favicon')
const bodyParser = require('body-parser')
const cors = require('cors')

dotenv.config({path:'./config.env'})

const path = require('path')
const { urlencoded } = require('express')
const app = express()
const port = process.env.PORT || 3001

const faviconPath = '/public/images/favicon/favicon.ico'
const publicPath = '/public'

app.use(cors({origin:"*"}))

app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.use(bodyParser.json())
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(bodyParser.urlencoded({ extended: true }))

// favicon
app.use(favicon(path.join(__dirname+faviconPath)))

// public static dir 
app.use(express.static(path.join(__dirname+publicPath)))

// three js
// app.use('/build/', express.static(path.join(__dirname, 'node_modules/three/build')))
// app.use('/jsm/', express.static(path.join(__dirname, 'node_modules/three/examples/jsm')))

//robots.txt
app.use('/robots.txt', function (req, res, next) {
    res.type('text/plain')
    res.send("User-agent: *\nAllow: /");
});

// pages
app.use('/',require(path.join(__dirname,'routes/index.js')))
app.use('/',require(path.join(__dirname,'routes/blogs.js')))
app.use('/',require(path.join(__dirname,'routes/games.js')))
app.use('/',require(path.join(__dirname,'routes/aboutus.js')))
app.use('/',require(path.join(__dirname,'routes/contactus.js')))
//terms and conditions and privacy policy
app.use('/',require(path.join(__dirname,'routes/privacypolicy.js')))
app.use('/',require(path.join(__dirname,'routes/termsandconditions.js')))
// Handle the 404 page. Anything after this will not be rendered.
app.use('/',require(path.join(__dirname,'routes/notfound.js')))

app.listen(port,()=>{console.log(`Web application is running on localhost port ${port}.`)})
