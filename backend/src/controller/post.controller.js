const Post = require("../models/Post.js");

const getAll = async (req, res) => {
    try {
      const posts = await Post.findAll();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch Posts.' });
    }
  };

  const getPostById = async (req, res) => {
    try {
        const id = req.params.id;
        const post = await Post.findByPk(id);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        res.json(post);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch Post.' });
    }
};

const createPost = async (req, res) => {
    try {
      console.log(req.body)
      const post = await Post.create(req.body);
      res.status(201).json(post);
    } catch (err) {
      res.status(500).json({ message: "server error Post has not been created" });
    }
  };


const updatePost = async (req, res) => {
  try {
      const id = req.params.id;
      await Post.update(req.body, { where: { id: id } });
      res.status(200).json({ message: "Post updated !" });
    } catch (err) {
      res.status(500).json({ message: "server error the Post has not been updated !" });
    }
  };

const deletePost = async (req, res) => {
    const id = req.params.id;

    try {
      const post = await Post.destroy({ where: { id: id } });
      res.status(200).json(post);
    } catch (err) {
      res.status(500).json({ message: "Post not found" });
    }
  };

  module.exports = {
    getAll,
    getPostById,
    createPost,
    updatePost,
    deletePost,
  }