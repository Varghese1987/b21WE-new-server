var express = require("express");
var router = express.Router();
// var dotenv = require("dotenv");

const { mongoClient } = require("../dbConfig");
const { hashing, authorize, roleAuth } = require("../helper/auth");

const dbUrl = process.env.DB_URL;

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

// Signup / registration
router.post("/register", async (req, res) => {
  console.log(dbUrl);
  let client = await mongoClient.connect(dbUrl);
  try {
    //select the db
    let db = client.db("b21WEDBNEW");
    //select the collection and perform db operation
    const hash = await hashing(req.body.password);
    req.body.password = hash;
    const data = await db.collection("users").insertOne(req.body);
    res.json({ message: "record Created" });
  } catch (error) {
    console.log(error);
    res.json({ message: "Something Went wrong" });
  } finally {
    //close connections
    client.close();
  }
});

// role vlues : {1:Admin,2:normal User}
router.get("/users", async (req, res) => {
  //open connection
  let client = await mongoClient.connect(dbUrl);
  try {
    //select the db
    let db = client.db("b21WEDBNEW");
    //select the collection and perform db operation
    const data = await db.collection("users").find().toArray();
    res.json({ message: "Success", data });
  } catch (error) {
    console.log(error);
    res.json({ message: "Something Went wrong" });
  } finally {
    //close connections
    client.close();
  }
});

module.exports = router;
