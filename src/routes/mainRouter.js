const router = require("express").Router();
const userRoutes = require("./userRoutes");
const appRoutes = require("./appRoutes");
const jobRoutes = require("./jobRoutes");
const categoryRoutes = require("./categoryRoutes");
const defaultRoutes = require("./defaultRoutes");
const companyRoutes = require("./companyRoutes");



//default
router.use(defaultRoutes);

//other routes
router.use(userRoutes);
router.use(appRoutes);
router.use(jobRoutes);
router.use(categoryRoutes);
router.use(companyRoutes);



module.exports = router;
