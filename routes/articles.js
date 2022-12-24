var express = require("express");
var router = express.Router();
const Article = require("../models/article");

router.get("/", (req, res) => {
  res.send("articles index");
});

// search route (by category or brand)
// expects: parameter, type, and sortBy
// ex: articles/search/category/acoustic/byPopularity
// ex: articles/search/brand/fender/byPrice
router.get("/search/:parameter/:type/:sortBy", async (req, res) => {
  const { parameter, type, sortBy } = req.params;
  let searchResult = undefined;

  // SEARCH BY CATEGORY (acoustic, electric, bass)
  if (parameter === "category")
    searchResult = await Article.find({ category: type });
  if (parameter === "brand") searchResult = await Article.find({ brand: type });

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

// search route (by user text input)
// expects: searchQuery and sortBy
// ex: articles/search/jaguar/byPrice
// ex: articles/search/acoustic/byPopularity
router.get("/search/:searchQuery/:sortBy", async (req, res) => {
  const { searchQuery, sortBy } = req.params;

  let searchResult = await Article.find({
    // in the db, search for articles that contain searchQuery within their reference
    label: { $regex: ".*" + searchQuery + ".*" },
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
