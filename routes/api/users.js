const express = require('express');
const router = express.Router();

// Route: GET req to api/users/test
// Description: Tests post route
// Access: Public

router.get('/test', (req, res) => res.json({ msg: 'Users Route Works' }));

module.exports = router;
