const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const User = require("./model/user");
const bcrypt = require("bcryptjs");
const { error } = require("console");
const jwt = require("jsonwebtoken");

//secret key
const JWT_SECRET = "dwagdw6tr86qyqdbjdn";

//database connection
mongoose
  .connect(
    "mongodb+srv://vijay:vijay@cluster0.daeg3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    }
  )
  .then(() => {
    console.log("connect");
  })
  .catch((e) => {
    console.log(e);
  });

const app = express();
app.use(bodyParser.json());

/*
Route           /api/register
Description     create user
Access          PUBLIC
Parameter       NONE
Methods         post
*/
app.post("/api/register", async (req, res) => {
  const { username, password: plainTextPassword } = req.body;
  if (plainTextPassword.length < 5) {
    return res.json({
      error: "password to small",
    });
  }
  const password = await bcrypt.hash(plainTextPassword, 10);

  try {
    const responce = await User.create({
      username,
      password,
    });
    console.log(responce);
    res, json(responce);
  } catch (e) {
    console.log(e);
  }
});

/*
Route           /api/login
Description     login user
Access          PUBLIC
Parameter       NONE
Methods         post
*/
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username }).lean();
  if (!user) {
    return res.json({ error: "invalid name/pass" });
  }

  if (await bcrypt.compare(password, user.password)) {
    const token = jwt.sign(
      {
        username: user.username,
      },
      JWT_SECRET
    );
    return res.json({ data: token });
  }

  res.json({ error: "Invalid username/password" });
});

app.get("/", async (req, res) => {
  const all = await User.find();
  return res.json(all);
});

//server
app.listen(9999, () => {
  console.log("Server up at 9999");
});
