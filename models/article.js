const mongoose = require('mongoose');
 
const articleSchema = mongoose.Schema({
    category: String,
    brand: String,
    model: String,
    price: Number,
    img: Array,
    popularity: Number,
    label: String,
    reference: String,
    description: String,
});
 
const Article = mongoose.model("articles", articleSchema);
 
module.exports = Article;
