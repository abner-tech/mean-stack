const express = require("express");
const bodyParser = require("body-parser");
const Post = require("./models/post");
const { default: mongoose } = require("mongoose");

const app = express();

mongoose
  .connect("mongodb://localhost:32771/mean-stack")
  .then(() => {
    console.log("connected to database");
  })
  .catch(() => {
    console.log("COnnection error");
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

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

app.post("/api/posts", (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
  });
  post.save().then((createdPost) => {
    res.status(201).json({ message: "post created", postId: createdPost._id });
  });
});

// Sample route
app.get("/api/posts", (req, res, next) => {
  Post.find().then((documents) => {
    res
      .status(200)
      .json({ message: "Post fetched successfully", posts: documents });
  });
});

app.delete("/api/posts/:id", (req, res, next) => {
  Post.deleteOne({ _id: req.params.id }).then((response) => {

    res.status(200).json({ message: "Post Deleted" });
  });
});

app.put("/api/posts/:id",(req, res , next) => {
  const newPost = new Post({
    _id: req.body.id,
    tittle: req.body.title,
    content: req.body.content
  });
  Post.updateOne({_id: req.params.id}, newPost)
  .then((result) => {
    console.log(result);
    res.status(200).json({message: "Update successfull"});
  });
});

app.get("/api/posts/:id", (req, res, next) => {
  Post.findById(req.params.id)
  .then((post) => {
    if(post) {
      res.status(200).json(post);
    } else 
    res.status(404).json({message: "post not found"});
  })
});

module.exports = app;
