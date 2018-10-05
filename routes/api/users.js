const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys.js');
const passport = require('passport');

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

// Route: GET req to api/users/login
// Description: User Login/ Returns JWT Token
// Access: Public

router.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  //Find user by email
  User.findOne({ email: email })
    .then(user => {
      // Check for user in DB
      if (!user) {
        return res.status(404).json({ email: 'User not found' });
      }

      //Check Password
      bcrypt.compare(password, user.password)
        //Returns true or false value via 'isMatch'
        .then(isMatch => {
          if (isMatch) {
            // User Matched
            // Create User jwt payload
            const payload = {
              id: user.id,
              name: user.name,
              avatar: user.avatar
            }

            //Sign the Token
            jwt.sign(payload, keys.secretOrKey, { expiresIn: '1h' },
              (err, token) => {
                res.json({
                  success: true,
                  token: 'Bearer ' + token,
                });
              });
          } else {
            return res.status(400).json({ password: 'Password Incorrect' });
          }
        })
    })
});

// Route: GET req to api/users/current
// Description: Returns current user
// Access: Private
router.get('/current', passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
    });
  });

module.exports = router;
