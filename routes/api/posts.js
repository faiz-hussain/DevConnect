const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

const Post = require('../../models/Post');

//Import Post validation
const validatePostInput = require('../../validation/post');

// Route: GET req to api/posts/test
// Description: Tests post route
// Access: Public

router.get('/test', (req, res) => res.json({ msg: 'Posts Route Works' }));

// Route: POST req to api/posts
// Description: Create a new post
// Access: Private
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { errors, isValid } = validatePostInput(req.body);

  //Check validation
  if (!isValid) {
    //If any errors return, send 400 with errors object
    return res.status(400).json(errors);
  };

  const newPost = new Post({
    text: req.body.text,
    name: req.body.name,
    avatar: req.body.avatar,
    user: req.user.id
  });

  newPost.save().then(post => res.json(post));
});

module.exports = router;
