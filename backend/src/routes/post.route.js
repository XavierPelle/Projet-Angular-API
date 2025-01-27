const { Router } = require('express');
const controller = require("../controller/post.controller");

const router = Router();

router.get("/", controller.getAll);
router.post("/create", controller.createPost);
router.put("/update/:id", controller.updatePost);
router.delete("/delete/:id", controller.deletePost);
router.get("/:id", controller.getPostById);

module.exports = router;