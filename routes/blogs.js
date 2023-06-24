const express = require('express')
const mongoose = require('mongoose')
const {marked}= require('marked')
const cDomPurify = require('dompurify') // c stands for create. dompurify will help us to sanitize to html.
const {JSDOM} = require('jsdom') // c stands for create.
const domPurify = cDomPurify(new JSDOM().window)
const router = express.Router()

// MONGOOSE

const DB = process.env.DATABASE

async function mongo() {
    await mongoose.connect(DB)
    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

mongo().then(()=>console.log('Mongodb connection established.')).catch(err => console.log(err))

// Schemas

let blogPostSchema = new mongoose.Schema({
    //Importants;
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
    author: 
    {
        type: String,
        required: true
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
    body: {
        type: String,
        required: true
    },
    i_src: {
        type: String,
        required: true
    },
    s_links: {
        l1: String,
        l2: String
    }, // Two social links..
    nsfw: Boolean,
    hidden: Boolean
})

const BlogPost = mongoose.model("BlogPost",blogPostSchema)
// this is amount of blogs we have to render per page.
let blogPerPageLimit = 5
// this is the number of blogs fetched from mongoose (needed for pagination)
let blogCount = 0
router.get('/blogs',async (req,res)=>{
    let page = req.query.page || 1
    blogPerPageLimit = req.query.limit || 5
    if(page < 1){page=1}
    if(blogPerPageLimit < 1){blogPerPageLimit=1}
    const search = req.query.search
    statusString=""
    if(search != undefined && search != "")
    {
        var blogPosts = await BlogPost.find({ title: {$regex:new RegExp(search+".*",'i')}}).sort({date:-1}).skip((page-1)*blogPerPageLimit).limit(blogPerPageLimit).lean().exec() // only load limited blogs per page
        if(blogPosts[0] === undefined)
        {
            statusString = `No results found for '${search}'.`
        }
        else
        {
            statusString = `Search results for '${search}'.`
        }
        blogCount = await BlogPost.countDocuments({ title: {$regex:new RegExp(search+".*",'i')}}).sort({date:-1})
    }
    else
    {
        var blogPosts = await BlogPost.find().sort({date:-1}).skip((page-1)*blogPerPageLimit).limit(blogPerPageLimit).lean() // newest one will come first
        if(blogPosts[0] === undefined)
        {
            statusString = "No blogs found."
        }
        else
        {
            statusString = "All blogs"
        }
        blogCount = await BlogPost.countDocuments()
    }

    blogPosts.forEach(element => {
        element.date = element.date.toLocaleDateString()
    });
    res.render('blogs',{
        blogs: blogPosts,
        pageNumber:(parseInt(page)),
        status:statusString
    })
})


router.get('/blogpost/:id',async (req,res)=>{
    try
    {
        const blogPost = await BlogPost.findById(req.params.id).lean()
        blogPost.body = domPurify.sanitize(marked.parse(blogPost.body))
        if(blogPost != null)
        res.render('blogpost',{
                blog: blogPost,
                date: blogPost.date.toLocaleDateString()
        })
    }
    catch(e)
    {
        res.render('../views/notfound')
    }
})

// POST data to get on client side.

// post the search data.
router.post('/blogs', async (req, res) => {
    // Apparently if I put then and catch the code doesn't work.
    let payload = req.body.payload
    searchResults = await BlogPost.find({ title: {$regex:new RegExp(payload+".*",'i')}}).exec()
    // post the blogCount data for pagination
    let check = true, pageHighBoundary = 1
    while(check)
    {
        if((blogPerPageLimit*pageHighBoundary)<blogCount)
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