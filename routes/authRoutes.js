const router = require("express").Router();
const { register, login } = require("../controllers/authController");
const auth = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.get("/health", (req , res) => {
    res.json({message: "isalive"});
});

module.exports = router;