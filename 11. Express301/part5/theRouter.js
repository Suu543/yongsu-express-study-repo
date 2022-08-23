const express = require("express");
let router = express.Router();

// router.use works the same that app.use does, but it's specific to this router

// instaed of
// app.get(...)
// we do:
// router.get(...)

router.get("/", (req, res, next) => {
  res.json({
    msg: "Router Works!",
  });
});

// router.all
// router.post
// router.delete
// router.put...

module.exports = router;
