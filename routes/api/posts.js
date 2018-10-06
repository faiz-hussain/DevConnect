const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

//Import Post and Profile models
const Post = require('../../models/Post');
const Profile = require('../../models/Profile');

//Import Post validation
const validatePostInput = require('../../validation/post');

// Route: GET req to api/posts/test
// Description: Tests post route
// Access: Public

router.get('/test', (req, res) => res.json({ msg: 'Posts Route Works' }));

// Route: GET req to api/posts
// Description: Get a post
// Access: Public
router.get('/', (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then(posts => res.json(posts))
    .catch(err => res.status(404).json({ nopostsfound: 'Sorry no posts were found' }));
});


// Route: GET req to api/posts/:id
// Description: Get a post by id
// Access: Public
router.get('/:id', (req, res) => {
  Post.findById(req.params.id)
    .then(post => res.json(post))
    .catch(err => res.status(404).json({ nopostfound: 'Sorry this post does not exist' }));
});


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


// Route: DELETE req to api/posts/:id
// Description: Delete a post
// Access: Private
router.delete('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          //Check to verify post is owned by user
          if (post.user.toString() !== req.user.id) {
            return res.status(401).json({ notauthorized: 'User not authorized for this action' })
          }

          //Delete post
          post.remove()
            .then(() => res.json({ success: true }));
        })
        .catch(err => res.status(400).json({ postnotfound: 'Post not found' }));
    })
});


// Route: POST req to api/posts/like/:id
// Description: Like a post
// Access: Private
router.post('/like/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
            return res.status(400).json({ alreadyliked: 'You have already liked this post' })
          }

          //Add user id to likes array
          post.likes.unshift({ user: req.user.id });

          post.save()
            .then(post => res.json(post));
        })
        .catch(err => res.status(400).json({ postnotfound: 'Post not found' }));
    });
});

// Route: POST req to api/posts/unlike/:id
// Description: Unlike a post
// Access: Private
router.post('/unlike/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
            return res.status(400).json({ alreadydisliked: 'You have not yet liked this post' })
          }

          //Get remove index
          const removeIndex = post.likes
            .map(item => item.user.toString())
            .indexOf(req.user.id);

          //Splice user out of likes array
          post.likes.splice(removeIndex, 1);

          //Save
          post.save()
            .then(post => res.json(post));
        })
        .catch(err => res.status(400).json({ postnotfound: 'Post not found' }));
    });
});
module.exports = router;
