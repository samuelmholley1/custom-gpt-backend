const express = require('express');
const router = express.Router();
const path = require('path');

/* GET home page. */
router.get('/', function(req, res, next) {
  // Use absolute path from project root for Vercel compatibility
  res.sendFile(path.join(process.cwd(), 'views/index.html'));
});

module.exports = router;
