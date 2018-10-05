const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const jwt = require('jsonwebtoken');

//Load Profile and User models
const Profile = require('../../models/Profile');
const User = require('../../models/User');

// Route: GET req to api/profile/test
// Description: Tests post route
// Access: Public
router.get('/test', (req, res) => res.json({ msg: 'Profile Route Works' }));

// Route: GET req to api/profile
// Description: Get current user profile
// Access: Private
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  const errors = {};

  Profile.findOne({ user: req.user.id })
    .then(profile => {
      if (!profile) {
        errors.noprofile = 'Profile not found'
        res.status(404).json(errors)
      }
      res.json(profile);
    })
    .catch(err => res.status(404).json(err));
});

module.exports = router;
