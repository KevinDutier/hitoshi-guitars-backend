var express = require("express");
var router = express.Router();
const Article = require("../models/article");

router.get("/", (req, res) => {
  res.send("articles index");
});

// SEARCH ROUTE (by user text input)
// expects: searchQuery and sortBy
// outputs: search result according to searchQuery (user text input) and sortBy
// ex: articles/search/jaguar/byPrice
// ex: articles/search/acoustic/byPopularity
router.get("/search/:searchQuery/:sortBy", async (req, res) => {
  const { searchQuery, sortBy } = req.params;

  let searchResult = await Article.find({
    // in the db, search for articles that contain searchQuery within their reference
    label: { $regex: ".*" + searchQuery.toLowerCase() + ".*" },
  });

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
// END OF SEARCH ROUTE

// GET ARTICLE DATA
// outputs article data by article reference
// ex: articles/fender-jaguar
router.get("/:reference", async (req, res) => {
  const { reference } = req.params;

  // find article with matching reference in database
  const searchResult = await Article.findOne({ reference });

  // no result found
  if (!searchResult) {
    res.json({
      result: false,
      searchResult,
      msg: `no result found`,
    });
    return;
  }

  // result found
  res.json({
    result: true,
    searchResult,
  });
});
// END OF GET ARTICLE DATA ROUTE

// ADD NEW ARTICLE (POST)
// expects: category, brand, mode, price, img
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
// END OF ADD NEW ARTICLE ROUTE

module.exports = router;
