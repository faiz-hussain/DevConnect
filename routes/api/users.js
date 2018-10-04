const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');

//Load User model
const User = require('../../models/User.js');

// Route: GET req to api/users/test
// Description: Tests post route
// Access: Public

router.get('/test', (req, res) => res.json({ msg: 'Users Route Works' }));

// Route: GET req to api/users/register
// Description: Register a new user
// Access: Public

//Sends in request from registration form/page
router.post('/register', (req, res) => {
  User.findOne({ email: req.body.email })
    .then(user => {
      //Returns message if user email already exists in DB or
      if (user) {
        return res.status(400).json({ email: 'Email already exists' });
      } else {
        //Creates new profile and gravatar with User info
        const avatar = gravatar.url(req.body.email, {
          s: '200', //Size
          rating: 'pg', //Rating
          default: 'mm' //Default pic
        });
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          avatar,
          password: req.body.password
        });

        //Password encryption and hash return
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            //Sets userpassword as the newly created hash.
            newUser.password = hash;
            newUser.save()
              .then(user => res.json(user)
                .catch(console.log(err)));
          });
        });
      }
    });
});

module.exports = router;
