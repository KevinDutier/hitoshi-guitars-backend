var express = require("express");
var router = express.Router();
const Brand = require("../models/brand");

router.get("/", (req, res) => {
  res.send("brands index");
});

router.post("/add", async (req, res) => {
  const { name, logo, description } = req.body;

  const newBrand = new Brand({
    name,
    logo,
    description,
  });

  newBrand.save().then(
    res.json({
      result: true,
      newBrand,
    })
  );
})

module.exports = router;
