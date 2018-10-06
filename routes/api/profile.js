const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const jwt = require('jsonwebtoken');

//Load Profile and User models
const Profile = require('../../models/Profile');
const User = require('../../models/User');

//Load validation
const validateProfileInput = require('../../validation/profile');
const validateExperienceInput = require('../../validation/experience');
const validateEducationInput = require('../../validation/education');


// Route: GET req to api/profile/test
// Description: Tests post route
// Access: Public
router.get('/test', (req, res) => res.json({ msg: 'Profile Route Works' }));

// Route: GET req to api/profile
// Description: Get current user profile
// Access: Private
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  const errors = {};

  //Reference user to DB based on user.id
  Profile.findOne({ user: req.user.id })
    .populate('user', ['name', 'avatar'])
    //Check if user has a profile or not
    .then(profile => {
      if (!profile) {
        errors.noprofile = 'Profile not found'
        res.status(404).json(errors)
      }
      res.json(profile);
    })
    .catch(err => res.status(404).json(err));
});


// Route: GET req to api/profile/handle/:handle
// Description: Get user profile based on handle
// Access: Public
router.get('/handle/:handle', (req, res) => {
  const errors = {};

  Profile.findOne({ handle: req.params.handle })
    .populate('user', ['name', 'avatar'])
    .then(profile => {
      if (!profile) {
        errors.noProfile = 'There is no profile associated with this handle';
        res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err => res.status(404).json(err));
});


// Route: GET req to api/profile/user/:user_id
// Description: Get user profile based on user id
// Access: Public
router.get('/user/:user_id', (req, res) => {
  const errors = {};

  Profile.findOne({ user: req.params.user_id })
    .populate('user', ['name', 'avatar'])
    .then(profile => {
      if (!profile) {
        errors.noProfile = 'There is no user associated with this id';
        res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err => res.status(404).json({ profile: 'There is no profile for this user' }));
});


// Route: GET req to api/profile/all
// Description: Get all user profiles
// Access: Public
router.get('/all', (req, res) => {
  const errors = {};
  Profile.find()
    .populate('user', ['name', 'avatar'])
    .then(profiles => {
      if (!profiles) {
        errors.noprofile = 'There are no profiles';
        return res.status(404).json(errors);
      }
      res.json(profiles);
    })
    .catch(err => res.status(404).json({ profile: 'There are currently no profiles' }));
});


// Route: POST req to api/profile
// Description: Create and/or edit user profile
// Access: Private
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { errors, isValid } = validateProfileInput(req.body);

  //Check Validation
  if (!isValid) {
    //Return any errors with 400 status
    return res.status(400).json(errors);
  }

  //Get profile fields
  const profileFields = {};
  profileFields.user = req.user.id;
  if (req.body.handle) { profileFields.handle = req.body.handle; };
  if (req.body.company) { profileFields.company = req.body.company; };
  if (req.body.website) { profileFields.website = req.body.website; };
  if (req.body.location) { profileFields.location = req.body.location; };
  if (req.body.bio) { profileFields.bio = req.body.bio; };
  if (req.body.status) { profileFields.status = req.body.status; };
  if (req.body.githubusername) { profileFields.githubusername = req.body.githubusername; };
  //Skills: needs to be split into an array since it is a CSV
  if (typeof req.body.skills !== undefined) { profileFields.skills = req.body.skills.split(','); };
  //Social
  profileFields.social = {};
  if (req.body.youtube) { profileFields.social.youtube = req.body.youtube; };
  if (req.body.twitter) { profileFields.social.twitter = req.body.twitter; };
  if (req.body.facebook) { profileFields.social.facebook = req.body.facebook; };
  if (req.body.linkedin) { profileFields.social.linkedin = req.body.linkedin; };
  if (req.body.instagram) { profileFields.social.instagram = req.body.instagram; };


  Profile.findOne({ user: req.user.id })
    .then(profile => {
      if (profile) {
        //Update profile if one already exists
        Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        )
          .then(profile => res.json(profile));
      } else {
        //Create new profile if one does not already exist

        //Check if profile handle already exists or not
        Profile.findOne({ handle: profileFields.handle })
          .then(profile => {
            if (profile) {
              errors.handle = 'Handle already exists';
              res.status(400).json(errors);
            }

            //Save/create profile
            new Profile(profileFields).save()
              .then(profile => res.json(profile));
          });
      }
    })
});


// Route: POST req to api/profile/experience
// Description: Add experience to profile
// Access: Private
router.post('/experience', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { errors, isValid } = validateExperienceInput(req.body);

  //Check Validation
  if (!isValid) {
    //Return any errors with 400 status
    return res.status(400).json(errors);
  }

  Profile.findOne({ user: req.user.id })
    .then(profile => {
      const newExp = {
        title: req.body.title,
        company: req.body.company,
        location: req.body.location,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      }

      //Add to experience array
      profile.experience.unshift(newExp);

      profile.save().then(profile => res.json(profile));
    })
});


// Route: POST req to api/profile/education
// Description: Add education to profile
// Access: Private
router.post('/education', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { errors, isValid } = validateEducationInput(req.body);

  //Check Validation
  if (!isValid) {
    //Return any errors with 400 status
    return res.status(400).json(errors);
  }

  Profile.findOne({ user: req.user.id })
    .then(profile => {
      const newExp = {
        school: req.body.school,
        degree: req.body.degree,
        fieldofstudy: req.body.fieldofstudy,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      }

      //Add to education array
      profile.education.unshift(newExp);

      profile.save().then(profile => res.json(profile));
    })
});

// Route: DELETE req to api/profile/experience/:exp_id
// Description: Delete experience
// Access: Private
router.delete('/experience/:exp_id', passport.authenticate('jwt', { session: false }), (req, res) => {

  Profile.findOne({ user: req.user.id })
    .then(profile => {
      //Get remove index
      const removeIndex = profile.experience
        .map(item => item.id)
        .indexOf(req.params.exp_id);

      //Splice out of array
      profile.experience.splice(removeIndex, 1);

      //Save
      profile.save().then(profile => res.json(profile))
        .catch(err => res.status(404).json(err));
    });
});


// Route: DELETE req to api/profile/education/:edu_id
// Description: Delete education
// Access: Private
router.delete('/education/:edu_id', passport.authenticate('jwt', { session: false }), (req, res) => {

  Profile.findOne({ user: req.user.id })
    .then(profile => {
      //Get remove index
      const removeIndex = profile.education
        .map(item => item.id)
        .indexOf(req.params.edu_id);

      //Splice out of array
      profile.education.splice(removeIndex, 1);

      //Save
      profile.save().then(profile => res.json(profile))
        .catch(err => res.status(404).json(err));
    });
});


// Route: DELETE req to api/profile
// Description: Delete user and profile
// Access: Private
router.delete('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOneAndRemove({ user: req.user.id })
    .then(() => {
      User.findOneAndRemove({ _id: req.user.id })
        .then(() => res.json({ success: true }))
        .catch(err => res.status(404).json(err))
    });
});

module.exports = router;
