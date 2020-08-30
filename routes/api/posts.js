const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");

const User = require("../../models/User");
const Post = require("../../models/Posts");
const Profile = require("../../models/Profile");

//Add Posts
router.post(
  "/",
  [auth, [check("text", "Text is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    }
    try {
      const user = await User.findById(req.user.id).select("-password");
      let post = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      });
      await post.save();
      res.json(post);
    } catch (error) {
      console.error("error.message");
      res.status(400).send("Server error");
    }
  }
);

// Get  all posts
router.get("/", auth, async (req, res) => {
  try {
    const post = await Post.find();

    res.json(post);
  } catch (err) {
    console.error("error.message");
    res.status(400).send("Server error");
  }
});
// Get  post by post id
router.get("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(400).json({ msg: "Post not found" });
    }

    res.json(post);
  } catch (err) {
    console.error("error.message");
    if (err.kind === "ObjectId") {
      return res.status(400).json({ msg: "Post not found" });
    }
    res.status(400).send("Server error");
  }
});
// Delete  post by post id
router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(400).json({ msg: "Post not found" });
    }
    await post.remove();

    res.json("Post deleted");
  } catch (err) {
    console.error("error.message");
    if (err.kind === "ObjectId") {
      return res.status(400).json({ msg: "Post not found" });
    }
    res.status(400).send("Server error");
  }
});
//For liking posts
router.put("/like/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id).length >
      0
    ) {
      return res.status(400).json({ msg: "Post has already been liked" });
    }
    post.likes.unshift({ user: req.user.id });

    await post.save();
    res.json(post.likes);
  } catch (error) {
    console.error("error.message");
  }
});

//For unliking post
//For liking posts
router.put("/unlike/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id)
        .length === 0
    ) {
      return res.status(400).json({ msg: "Post has not yet been liked" });
    }
    post.likes.pop(req.user.id);

    await post.save();
    res.json(post.likes);
  } catch (error) {
    console.error("error.message");
  }
});

//Add comments
router.post(
  "/comment/:id",
  [auth, [check("text", "Text is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    }
    try {
      const user = await User.findById(req.user.id).select("-password");
      const post = await Post.findById(req.params.id);
      const comment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      };
      post.comments.unshift(comment);
      await post.save();
      res.json(post.comments);
    } catch (error) {
      console.error("error.message");
      res.status(400).send("Server error");
    }
  }
);

// Delete comment by post and comment id
router.delete("/comment/:id/:comment_id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    //Pull out comment
    const comment = post.comments.find(
      (comment) => comment.id === req.params.comment_id
    );
    if (!comment) {
      return res.status(400).json({ msg: "Comment not found" });
    }

    await comment.remove(req.params.comment_id);

    await post.save();

    res.json(post.comments);
  } catch (err) {
    console.error("error.message");
    if (err.kind === "ObjectId") {
      return res.status(400).json({ msg: "Post not found" });
    }
    res.status(400).send("Server error");
  }
});

module.exports = router;
