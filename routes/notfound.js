const express = require('express')
const router = express.Router()

router.get('*',(req,res)=>{
    res.render('../views/notfound')
    // res.sendFile(path.join(__dirname,'../views/index.html'))
})

module.exports = router