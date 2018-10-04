const express = require('express');
const router = express.Router();

// Route: GET req to api/profile/test
// Description: Tests post route
// Access: Public

router.get('/test', (req, res) => res.json({ msg: 'Profile Route Works' }));

module.exports = router;
