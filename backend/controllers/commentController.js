const Comment = require("../models/Comment");
const Post = require("../models/Post");

exports.getComments = async (req, res) => {
  const comments = await Comment.find({ post: req.params.postId });
  res.json(comments);
};

exports.addComment = async (req, res) => {
  const { text, name } = req.body;

  if (!text || !name)
    return res.status(400).json({ message: "All fields required" });

  const comment = await Comment.create({
    text,
    name,
    post: req.params.postId,
  });

  res.status(201).json(comment);
};

exports.deleteComment = async (req, res) => {
  const comment = await Comment.findById(req.params.commentId).populate("post");

  if (!comment) return res.status(404).json({ message: "Comment not found" });

  if (!req.user)
    return res.status(401).json({ message: "Login required" });

  if (comment.post.author.toString() !== req.user._id.toString())
    return res.status(401).json({ message: "Only post owner can delete" });

  await comment.deleteOne();
  res.json({ message: "Comment deleted" });
};
