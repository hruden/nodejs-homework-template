const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar")
const path = require("path")
const fs = require("fs/promises")
const Jimp = require("jimp");
const {nanoid} = require("nanoid")

const  User  = require("../models/users");

const { SECRET_KEY, BASE_URL } = process.env;

const { HttpError, ctrlWrapper, sendEmail } = require("../helpers");

const avatarsDir = path.join(__dirname, "../", "public", "avatars")

const updateAvatar =async(req, res) =>{
  const {_id} = req.user
  const {path: tempUpload, originalname, size} = req.file
  const filename = `${_id}_${size}_${originalname}`;
  const resultUpload = path.join(avatarsDir, filename)
  const avatar = await Jimp.read(tempUpload)
  avatar.resize(250, 250)
  await fs.rename(tempUpload, resultUpload)
  const avatarURL = path.join("avatars", filename)
  await User.findByIdAndUpdate(_id, {avatarURL})

  res.status(200).json({
    avatarURL
  })
}
const register = async (req, res) => {
  const {password, email} = req.body;
  const user = await User.findOne({email})
  if (user) {
    throw HttpError(409, "Email in use");
  }
  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email)
  const verificationToken = nanoid()

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
    verificationToken,
  });
  
  const verifyEmail = {
    to: email,
    subject: "Test email",
    html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${verificationToken}">click here</a>`
  }
  await sendEmail(verifyEmail)
  
  res.status(201).json({
    email: newUser.email,
    subscription: newUser.subscription,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }
  if(!user.verify){
    throw HttpError(401, "User not verified");
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }
  const payload = {
    id: user._id,
  };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
  await User.findByIdAndUpdate(user._id, { token });

  res.status(200).json({
    token,
    email: user.email,
    subscription: user.subscription,
  });
};
const getCurrent = async (req, res) => {
  const { email, subscription} = req.user;

  res.status(200).json({
    email,
    subscription
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });

  res.status(204).json({
    message: "No Content",
  });
};


module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  updateAvatar: ctrlWrapper(updateAvatar)
};
