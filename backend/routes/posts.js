const express = require('express');
const Post = require("../models/post");
const multer = require("multer");

const router = express.Router();
const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error('Invalid mime type');
    if( isValid ) {
      error = null;
    };
    callback(error, "backend/images");
  },
  filename: (req, file, callback) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const extension = MIME_TYPE_MAP[file.mimetype];
    callback(null, name+'-'+Date.now()+'.'+extension);
  },
});

router.post("",multer({storage: storage}).single("image") ,(req, res, next) => {
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
    });
    post.save().then((createdPost) => {
      res.status(201).json({ message: "post created", postId: createdPost._id });
    });
  });

  // Sample route
  router.get("", (req, res, next) => {
    Post.find().then((documents) => {
      res
        .status(200)
        .json({ message: "Post fetched successfully", posts: documents });
    });
  });

  router.delete("/:id", (req, res, next) => {
    Post.deleteOne({ _id: req.params.id }).then((response) => {

      res.status(200).json({ message: "Post Deleted" });
    });
  });

  router.put("/:id",(req, res , next) => {
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

  router.get("/:id", (req, res, next) => {
    Post.findById(req.params.id)
    .then((post) => {
      if(post) {
        res.status(200).json(post);
      } else
      res.status(404).json({message: "post not found"});
    });
  });

  module.exports = router;
