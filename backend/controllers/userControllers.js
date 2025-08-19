const User = require("../models/userModels");
const generateTokens = require("../generateToken");
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(
  "582063331026-1vipq82mnl3p8rqmq7e14gbq886an35e.apps.googleusercontent.com"
);

const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;

    const verifyCred = await client.verifyIdToken({
      idToken: credential,
      audience:
        "582063331026-1vipq82mnl3p8rqmq7e14gbq886an35e.apps.googleusercontent.com",
    });

    const payload = verifyCred.getPayload();
    // console.log(payload)
    const { email, name } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        password: Math.random().toString(36),
      });
    }

    const { accessToken, refreshToken } = generateTokens(user._id);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      path: "/api/token",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "lax",
      secure: false,
    });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      accessToken,
    });
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Google authentication failed" });
  }
};

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please Enter all the Fields");
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    const { accessToken, refreshToken } = generateTokens(user._id);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      path: "/api/token",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "lax",
      secure: false,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      accessToken,
    });
  } else {
    res.status(400);
    throw new Error("Failed to create user");
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    const { accessToken, refreshToken } = generateTokens(user._id);
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      path: "/api/token",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "lax",
      secure: false,
    });
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      accessToken,
    });
  } else {
    res.status(401);
    throw new Error("Invalid Email or Password");
  }
};

module.exports = { registerUser, loginUser, googleLogin };
