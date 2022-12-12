var express = require('express');
var router = express.Router();

// http://localhost:3000/
router.get("/", (req, res) => {
  res.send("backend index");
});

module.exports = router;
