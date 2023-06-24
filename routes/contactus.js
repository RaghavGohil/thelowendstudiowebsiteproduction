const express = require('express')
const router = express.Router()

router.get('/contactus',(req,res)=>{
    res.render('../views/contactus')
    // res.sendFile(path.join(__dirname,'../views/index.html'))
})

module.exports = router