const { Router } = require('express');
const controller = require("../controller/user.controller");
const router = Router();

// Route de test pour voir si le middleware fonctionne
// router.get("/bonjour", (req, res) => {
//     console.log(req.auth);
//     res.send("Bonjour");
// });

//Route d'inscription et de connexion
router.post("/register", controller.register);
router.post('/login', controller.login);

module.exports = router;