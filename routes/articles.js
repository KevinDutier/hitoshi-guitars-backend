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

router.get("/search/c/:category/:parameter", async (req, res) => {
  const { category, parameter } = req.params;

  // SEARCH BY CATEGORY (acoustic, electric, bass)
  let searchResult = await Article.find({ category });

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
  if (parameter === "byPopularity") {
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
  if (parameter === "byBrand") {
    searchResult = searchResult.sort((a, b) => a.brand.localeCompare(b.brand));
    res.json({
      result: true,
      searchResult,
    });
    return;
  }

  // by price (lowest to highest)
  if (parameter === "byPrice") {
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

router.get("/search/b/:brand/:parameter", async (req, res) => {
  const { brand, parameter } = req.params;

  // SEARCH BY BRAND (fender, ibanez...)
  let searchResult = await Article.find({ brand });

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
  if (parameter === "byPopularity") {
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
  if (parameter === "byBrand") {
    searchResult = searchResult.sort((a, b) => a.brand.localeCompare(b.brand));
    res.json({
      result: true,
      searchResult,
    });
    return;
  }

  // by price (lowest to highest)
  if (parameter === "byPrice") {
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
