const userModel = require("./../../db/models/user");
const taskModel = require("./../../db/models/task");

require("dotenv").config();

const jwt = require("jsonwebtoken");
const SECRETKEY = process.env.SECRETKEY;

const bcrypt = require("bcrypt");
const SALT = Number(process.env.SALT);

const signUp = async (req, res) => {
  const { email, password, role } = req.body;
  const saveEmail = email.toLowerCase();
  const savePass = await bcrypt.hash(password, SALT);

  const newUser = new userModel({
    email: saveEmail,
    password: savePass,
    role,
  });

  newUser
    .save()
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

const logIn = (req, res) => {
  const { email, password } = req.body;
  const saveEmail = email.toLowerCase();

  userModel
    .findOne({ email: saveEmail })
    .then(async (result) => {
      if (result) {
        if (saveEmail == result.email) {
          const savePass = await bcrypt.compare(password, result.password);
          if (savePass) {
            const payload = {
              role: result.role,
            };
            const token = await jwt.sign(payload, SECRETKEY);
            res.status(200).json({ result, token });
          } else {
            console.log("pass");
            res.status(400).json("invalid email or password");
          }
        } else {
          console.log("email");

          res.status(400).json("invalid email or password");
        }
      } else {
        res.status(404).json("not found");
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
};

const allUsers = async (req, res) => {
  userModel
    .find({})
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

const deleteUser = async (req, res) => {
  const { _id } = req.body;
  userModel.findById({ _id }).then((result) => {
    console.log(result);
    if (result) {
      userModel.deleteOne({ _id }, function (err) {
        if (err) return handleError(err);
      });
      taskModel.deleteMany({ user: _id }, function (err) {
        if (err) return handleError(err);
      });

      res.status(200).json("done");
    } else {
      return res.status(404).json("user not found");
    }
  });
};

module.exports = { signUp, logIn, allUsers, deleteUser };
