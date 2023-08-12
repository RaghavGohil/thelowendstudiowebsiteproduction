const express = require('express')
const router = express.Router()

router.get('/sitemap.xml',(req,res)=>{
    res.sendFile(path.join(__dirname,'../public/sitemap.xml'))
})

module.exports = router