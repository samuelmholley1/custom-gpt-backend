const express = require('express');
const router = express.Router();
const path = require('path');

/* GET home page. */
router.get('/', function(req, res, next) {
  // Serve the static HTML file instead of trying to render a view
  res.sendFile(path.join(__dirname, '../views/index.html'));
});

module.exports = router;
