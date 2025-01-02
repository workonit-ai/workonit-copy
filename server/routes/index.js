let router = require("express").Router();

router.get("/server", (req, res) => {
    res.json("Server is running");
})

router.use("/api", require("./api"));

module.exports = router;
