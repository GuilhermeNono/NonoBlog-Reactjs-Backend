const User = require("../models/User");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");

require("dotenv").config()

const jwtSecret = process.env.JWT_SECRET;

//Generate user token
const generateToken = (id) => {
  return jwt.sign({ id }, jwtSecret, {
    expiresIn: "7d",
  });
};


//Register user and sign in
const register = async (req, res) => {
    const {name, email, password} = req.body;

    //Check if user exist
    const user = await User.findOne({email});

    if(user) {
        res.status(422).json({errros: ["Por favor, utilize outro e-mail"]});
        return
    }

    //Generate password hash
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    //Create User
    const newUser = await User.create({
        name,
        email,
        password: passwordHash
    })

    //If user was created successfuly, return the token
    if(!newUser) {
        res.status(422).json({errors: ["Houve um erro, por favor, entre mais tarde."]});
        return
    }

    res.status(201).json({
      _id: newUser._id,
      token: generateToken(newUser._id),
    });
}

//Sign in User
const login = async (req, res) => {
  const {email, password} = req.body;

  const user = await User.findOne({email:email})


  //Check if user exists
  if(!user) {
    console.log(user)
    res.status(404).json({errors:["Usuario não encontrado"]})
    return
  }

  //Check if password matches
  if(!(await bcrypt.compare(password, user.password))){
    res.status(422).json({errors:["Senha inválida."]})
    return
  }

  //Return user with token
  res.status(201).json({
    _id: user._id,
    profileImage: user.profileImage,
    token: generateToken(user._id),
  });

}

const getCurrentUser = async (req, res) => {
  const user = req.user;

  res.status(200).json(user)
}

const update = async (req, res) => {
  const {name, password, bio} = req.body;

  let profileImage = null;

  if(req.file) {
    profileImage = req.file.filename
  }

  const reqUser = req.user;

  const user = await User.findById(mongoose.Types.ObjectId(reqUser.id)).select("-password");

  if(name) {
    user.name = name;
  }

  if(password) {
    //Generate password hash
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);
    user.password = passwordHash
  }

  if(bio) {
    user.bio = bio
  }

  if(profileImage) {
    user.profileImage = profileImage
  }

  await user.save();

  res.status(200).json(user)
}

const getUserById = async (req, res) => {
  const {id} = req.params;

  try {

    const user = await User.findById(mongoose.Types.ObjectId(id)).select("-password");

    if(!user){
      res.status(404).json({errors:["Usuário não encontrado."]})
      return;
    }

    res.status(200).json(user)
    
  } catch (error) {
    res.status(404).json({errors:["Usuário não encontrado."]})
      return;
  }
}

module.exports = {
    update,
    register,
    getUserById,
    login,
    getCurrentUser
}