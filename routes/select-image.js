var express = require('express');
var router = express.Router();


router.post("/", (req,res,next) => {
    console.log("REQ.BODY ===>", req.body)
    
    res.render("/AI-Images/image1.hbs", req.body)

})


module.exports = router;