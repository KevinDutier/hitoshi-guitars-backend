require("dotenv").config();

const connection = require("./models/connection");

const express = require("express");
const helmet = require("helmet");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");

// routers
const indexRouter = require("./routes/index");
const articlesRouter = require("./routes/articles");

const app = express();

// app.use()
app.use(helmet());
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.listen(3000);

// router prefixes
app.use("/", indexRouter);
app.use("/articles", articlesRouter);

module.exports = app;
