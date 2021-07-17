var express = require("express");
var router = express.Router();
const { mongoClient } = require("../dbConfig");
const { authorize } = require("../helper/auth");
const dbUrl = process.env.DB_URL;

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.post("/add-product", [authorize], async (req, res) => {
  const client = await mongoClient.connect(dbUrl);
  const { name, price, qty, category } = req.body;
  try {
    let db = client.db("b21WEDBNEW");
    try {
      let document = db
        .collection("products")
        .insertOne({ name, price, qty, category });
      res.json({ message: "Record added" });
    } catch (error) {
      client.close();
    }
  } catch (error) {
    client.close();
    console.log(error);
    res.sendStatus(500);
  }
});

router.get("/get-products", [authorize], async (req, res) => {
  let client = await mongoClient.connect(dbUrl);
  try {
    let db = client.db("b21WEDBNEW");
    try {
      let document = await db.collection("products").find().toArray();
      res.json({ document });
    } catch (error) {
      client.close();
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

module.exports = router;
