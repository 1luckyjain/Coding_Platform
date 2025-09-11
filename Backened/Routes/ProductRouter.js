const ensureAuthenticated = require("../Middlewares/Auth");

const router = require("express").Router();

router.get("/", ensureAuthenticated, (req, res) => {
  console.log("ok");
  res.status(200).json([
    {
      name: "mobile",
      price: 10000,
    },
    {
      name: "phone",
      price: 40000,
    },
  ]);
});

module.exports = router;
