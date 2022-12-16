const mongoose = require('mongoose');
 
const articleSchema = mongoose.Schema({
    category: String,
    brand: String,
    model: String,
    price: Number,
    img: String,
    popularity: Number,
});
 
const Article = mongoose.model("articles", articleSchema);
 
module.exports = Article;
