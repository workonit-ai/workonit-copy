let router = require("express").Router();
const timeout = require("connect-timeout");

// router.use(timeout("60s"));
router.use("/user", require("./user"));
router.use("/otp", require("./otp"));
router.use("/chat", require("./chat"));
router.use("/assistant", require("./assistant"));
router.use("/admin", require("./admin"));
router.use("/company", require("./company"));
router.use("/twitter", require("./twitter"));
router.use("/files", require("./files"));
module.exports = router;
