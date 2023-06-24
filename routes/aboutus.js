const express = require('express')
const router = express.Router()

router.get('/aboutus',(req,res)=>{
    res.render('../views/aboutus')
    // res.sendFile(path.join(__dirname,'../views/index.html'))
})

module.exports = router