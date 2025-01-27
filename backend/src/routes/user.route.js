const { Router } = require('express');
const controller = require("../controller/user.controller");

const router = Router();

router.get("/", controller.getAll);
router.get("/:email", controller.getUserByEmail)
router.post("/create", controller.createUser);
router.put("/update/email/:email", controller.updateUserByEmail);
router.put("/update/:id", controller.updateUser);
router.delete("/delete/:id", controller.deleteUser);
router.get("/:id", controller.getUserById);

module.exports = router;