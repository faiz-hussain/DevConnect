const express = require('express');
const router = express.Router();

// Route: GET req to api/posts/test
// Description: Tests post route
// Access: Public

router.get('/test', (req, res) => res.json({ msg: 'Posts Route Works' }));

module.exports = router;
