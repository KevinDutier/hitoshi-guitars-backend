const mongoose = require('mongoose');
 
const brandSchema = mongoose.Schema({
    name: String,
    description: String,
    logo: String,
});
 
const Article = mongoose.model("brands", brandSchema);
 
module.exports = Article;
