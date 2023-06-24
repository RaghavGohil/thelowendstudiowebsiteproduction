const express = require('express')
const router = express.Router()

router.get('/privacypolicy',(req,res)=>{
    res.render('../views/privacypolicy')
    // res.sendFile(path.join(__dirname,'../views/index.html'))
})

module.exports = router