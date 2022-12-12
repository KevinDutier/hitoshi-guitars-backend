const mongoose = require('mongoose');
 
const userSchema = mongoose.Schema({
    username: String,
    usernameFormatted: String,
    password: String,
    token: String,
});
 
const User = mongoose.model("users", userSchema);
// "users" is the name of the collection
 
module.exports = User;
