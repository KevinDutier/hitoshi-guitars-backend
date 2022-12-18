var express = require("express");
var router = express.Router();
const Article = require("../models/article");

router.get("/", (req, res) => {
  res.send("articles index");
});

router.get("/search/:parameter/:sortBy", async (req, res) => {
  const { parameter, sortBy } = req.params;

  // SEARCH BY CATEGORY (acoustic, electric, bass)
  let searchResult = await Article.find({ category: parameter });

  // no result found
  if (!searchResult.length) {
    res.json({
      result: false,
      searchResult,
      msg: `no result found`,
    });
    return;
  }

  // result found, sorting
  // by popularity (highest to lowest)
  if (sortBy === "byPopularity") {
    searchResult = searchResult.sort(
      (a, b) => parseFloat(a.popularity) + parseFloat(b.popularity)
    );
    res.json({
      result: true,
      searchResult,
    });
    return;
  }

  // by brand (alphabetical)
  if (sortBy === "byBrand") {
    searchResult = searchResult.sort((a, b) => a.brand.localeCompare(b.brand));
    res.json({
      result: true,
      searchResult,
    });
    return;
  }

  // by price (lowest to highest)
  if (sortBy === "byPrice") {
    searchResult = searchResult.sort(
      (a, b) => parseFloat(a.price) - parseFloat(b.price)
    );
    res.json({
      result: true,
      searchResult,
    });
    return;
  }
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
