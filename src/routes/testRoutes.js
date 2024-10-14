const { createTest, getAllTest } = require("../controllers/testController");

const router = require("express").Router();

router.post("/test", createTest);
router.get("/test", getAllTest);

module.exports = router;