var express = require('express');
const User = require('../models/User');
const Creator = require('../models/Creator');
var router = express.Router();
// api key goes to .env
const API_KEY = "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"

const { isCreatorLoggedIn } = require('../middleware/creator-route-guard');
const {isUserLoggedIn} = require('../middleware/user-route-guard')

router.get('/update-creator-img', (req, res) => {
    res.render("creator-auth/update-creator-img.hbs")
})
router.post('/update-creator-img', async (req, res, next) => {
    console.log(req.body)
        const options ={
            method: "POST",
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "prompt": req.body.userPrompt,
                "n": 4,
                "size": "1024x1024"
    
            })
        }

        try {
          const response = await fetch("https://api.openai.com/v1/images/generations", options)
          const data = await response.json()
          console.log(data)
          res.render("AI-Images/image-selector.hbs", {images: data.data})
        //   res.render("AI-Images/image-selector.hbs", {images: [1, 2, 3, 4]}) //if you want to make it actually work delete this and uncomment above
          }   
         catch (error) {
            console.error(error)
        }
})




router.get('/update-user-img', (req, res) => {
    res.render("user-auth/update-user-img.hbs")
})
router.post('/update-user-img', async (req, res, next) => {
    console.log(req.body)
        const options ={
            method: "POST",
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "prompt": req.body.userPrompt,
                "n": 4,
                "size": "1024x1024"
    
            })
        }

        try {
          const response = await fetch("https://api.openai.com/v1/images/generations", options)
          const data = await response.json()
          console.log(data)
          res.render("AI-Images/image-selector.hbs", {images: data.data})
        //   res.render("AI-Images/image-selector.hbs", {images: [1, 2, 3, 4]}) //if you want to make it actually work delete this and uncomment above
          }   
         catch (error) {
            console.error(error)
        }
    

})
//Need if statement for user profile image
router.post("/update/profile-image", (req, res) => {
    if (req.session.creator && isCreatorLoggedIn) {
        console.log("REQ.CREATOR ===> ",req.session.creator);
       Creator.findByIdAndUpdate(
        req.session.creator._id,
        { profileImage: req.body.selectedImage },
        { new: true }
      )
        .then((user) => {
          req.session.creator = user;
          console.log(user);
          res.redirect("/creators/creator-profile");
        })
        .catch((err) => {
          console.error(err);
          res.status(500).send("Error updating creator profile image.");
        });
    } else if (req.session.user && isUserLoggedIn) {
      console.log("REQ.USER ===> ",req.session.user);
      User.findByIdAndUpdate(
        req.session.user._id,
        { profileImage: req.body.selectedImage },
        { new: true }
      )
        .then((user) => {
          req.session.user = user;
          console.log(user);
          res.redirect("/user/user-profile");
        })
        .catch((err) => {
          console.error(err);
          res.status(500).send("Error updating user profile image.");
        });
    } else {
      res.status(403).send("Unauthorized");
    }
  });


module.exports = router;



