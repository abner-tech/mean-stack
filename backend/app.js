const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require('path')

const postsRoutes = require('./routes/posts')

const app = express();

mongoose
  .connect("mongodb://localhost:32771/mean-stack")
  .then(() => {
    console.log("connected to database");
  })
  .catch(() => {
    console.log("Connection error");
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join('backend/images')))

// Middleware to enable CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  ); // Fixed here
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, PUT, OPTIONS"
  );
  next();
});

app.use("/api/posts", postsRoutes);

module.exports = app;
 