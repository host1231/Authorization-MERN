const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const UserModel = require("./models/UserModel");
const Auth = require("./middleware/auth");

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: ["http://localhost:3000"],
  methods: ["GET", "POST"],
  credentials: true
}));

app.get("/auth/me", Auth, async (req, res) => {
  const user = await UserModel.findById(req.userId);

  if (!user) {
    return res.status(404).json({
      message: 'Пользователь не найден'
    });
  }

  const {passwordHash, ...userData} = user._doc;

  res.json({
    userData
  })
});


app.post("/auth/register", async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const doc = new UserModel({
      fullName,
      email,
      passwordHash: hash,
    });

    const user = await doc.save();

    res.json(user);
  } catch (err) {
    console.log(err);
    return res.status(401).json({
      message: "Ошибка регистрации",
    });
  }
});

app.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "Не совпадает логин",
      });
    }

    const passwordValid = await bcrypt.compare(
      password,
      user._doc.passwordHash
    );

    if (!passwordValid) {
      return res.status(404).json({
        message: "Не совпадает пароль",
      });
    }

    const token = await jwt.sign(
      {
        _id: user._doc._id,
      },
      "secret123",
      {
        expiresIn: "1d",
      }
    );

    res.cookie("token", token);

    res.json({
      user,
      token,
    });
  } catch (err) {
    console.log(err);
    return res.status(401).json({
      message: "Ошибка авторизации",
    });
  }
});



try {
  mongoose
    .connect(
      "mongodb+srv://pg15182100:secret123@cluster0.hmkg0ym.mongodb.net/blog?retryWrites=true&w=majority"
    )
    .then(() => {
      app.listen(3002, () => {
        console.log("DB OK!, Server OK");
      });
    });
} catch (err) {
  console.log(err);
}
