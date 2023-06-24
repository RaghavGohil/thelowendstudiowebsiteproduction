const express = require('express')
const mongoose = require('mongoose')
const {marked}= require('marked')
const router = express.Router()

// MONGOOSE

const DB = process.env.DATABASE

async function mongo() {
    await mongoose.connect(DB)
    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

mongo().then(()=>console.log('Mongodb connection established.')).catch(err => console.log(err))

// Schemas

let gamePostSchema = new mongoose.Schema({
    published: {
        type: Boolean,
        default: false
    },
    date: {
        type: Date,
        default: Date.now
    },
    u_date: { // u stands for update
        type: Date,
        default: Date.now
    },
    category:{
        type: Array,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    tags: {
        type: Array,
        required: true
    },
    s_os: {
        type: String,
        required: true
    }, // stands for supported operating systems
    i_src: {
        type: String,
        required: true
    },
    d_link:
    {
        type: String,
        required: true
    }, // Download Link
    nsfw:
    {
        type: Boolean,
        default: false
    },
    hidden: Boolean
})

const GamePost = mongoose.model("GamePost",gamePostSchema)
// this is amount of games we have to render per page.
let gamePerPageLimit = 5
// this is the number of games fetched from mongoose (needed for pagination)
let gameCount = 0
router.get('/games',async (req,res)=>{
    let page = req.query.page || 1
    gamePerPageLimit = req.query.limit || 5
    if(page < 1){page=1}
    if(gamePerPageLimit < 1){gamePerPageLimit=1}
    const search = req.query.search
    statusString=""
    if(search != undefined && search != "")
    {
        var gamePosts = await GamePost.find({ title: {$regex:new RegExp(search+".*",'i')}}).sort({date:-1}).skip((page-1)*gamePerPageLimit).limit(gamePerPageLimit).lean().exec() // only load limited games per page
        if(gamePosts[0] === undefined)
        {
            statusString = `No results found for '${search}'.`
        }
        else
        {
            statusString = `Search results for '${search}'.`
        }
        gameCount = await GamePost.countDocuments({ title: {$regex:new RegExp(search+".*",'i')}}).sort({date:-1})
    }
    else
    {
        var gamePosts = await GamePost.find().sort({date:-1}).skip((page-1)*gamePerPageLimit).limit(gamePerPageLimit).lean() // newest one will come first
        if(gamePosts[0] === undefined)
        {
            statusString = "No games found."
        }
        else
        {
            statusString = "All games"
        }
        gameCount = await GamePost.countDocuments()
    }

    gamePosts.forEach(element => {
        element.date = element.date.toLocaleDateString()
    });
    res.render('games',{
        games: gamePosts,
        pageNumber:(parseInt(page)),
        status:statusString
    })
})


router.get('/gamepost/:id',async (req,res)=>{
    try
    {
        const gamePost = await GamePost.findById(req.params.id).lean()
        gamePost.body = domPurify.sanitize(marked.parse(gamePost.body))
        if(gamePost != null)
        res.render('gamepost',{
                game: gamePost,
                date: gamePost.date.toLocaleDateString()
        })
    }
    catch(e)
    {
        res.render('../views/notfound')
    }
})

// POST data to get on client side.

// post the search data.
router.post('/games', async (req, res) => {
    // Apparently if I put then and catch the code doesn't work.
    let payload = req.body.payload
    searchResults = await GamePost.find({ title: {$regex:new RegExp(payload+".*",'i')}}).exec()
    // post the gameCount data for pagination
    let check = true, pageHighBoundary = 1
    while(check)
    {
        if((gamePerPageLimit*pageHighBoundary)<gameCount)
        {
            pageHighBoundary+=1
        }
        else
        {
            check = false
        }
    }
    res.send({payload:searchResults , pageHighBoundary:pageHighBoundary})
    // ... do whatever you want and send a response, e.g.:
    
})



module.exports = router