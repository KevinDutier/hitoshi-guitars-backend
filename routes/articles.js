var express = require("express");
var router = express.Router();
const Article = require("../models/article");

router.get("/", (req, res) => {
  res.send("articles index");
});

router.get("/all", async (req, res) => {
  const allArticles = await Article.find();

  res.json({
    allArticles,
  });
});

router.get("/search/:category", async (req, res) => {
  const { category } = req.params;

  // search by category
  const searchResult = await Article.find({ category });

  // no result found
  if (!searchResult.length) {
    res.json({
      result: false,
      searchResult,
      msg: `no result found`
    })
    return;
  }

  // results found
  res.json({
    result: true,
    searchResult,
  });
});

router.post("/add", async (req, res) => {
  // destructuring
  const { category, brand, model, price, img } = req.body;

  const newArticle = new Article({
    category,
    brand,
    model,
    price,
    img,
  });

  newArticle.save().then(
    res.json({
      result: true,
      newArticle,
    })
  );
});

module.exports = router;
