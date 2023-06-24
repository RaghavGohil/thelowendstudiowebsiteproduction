const express = require('express')
const router = express.Router()

router.get('/termsandconditions',(req,res)=>{
    res.render('../views/termsandconditions')
    // res.sendFile(path.join(__dirname,'../views/index.html'))
})

module.exports = router