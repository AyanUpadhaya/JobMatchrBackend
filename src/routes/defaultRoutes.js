const router = require("express").Router();
const logger = require("../logger/logger");

router.get("/", (req, res) => {
  logger.log("info", "welcome to the server!");
  return res.send("JobMatchr server running");
});

module.exports = router;
