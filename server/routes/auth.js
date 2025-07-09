 const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Profile = require("../models/profile");

router.post("/register", async (req, res) => {
    const {name, email, password} = req.body;
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedpassword = await bcrypt.hash(password, salt);
        const user = new User({name, email, password: hashedpassword});
        await user.save();

        const profile = new Profile({
            user: user._id,
            bio: "",
            phone: "",
            gender: "",
            dob: null,
            avatar: "",
            location: "",
        });
        await profile.save();

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: "1d"});
        res.status(201).json({token, user});

    } catch(err) {
        console.error(err);
        res.status(500).json({message: "Error creating user"});
    }
});

router.post("/login", async(req, res) => {
  try {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if(!user) return res.status(401).json({message: "Invalid credentials"});

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) return res.status(401).json({message: "Invalid credentials"}); 

    const existingProfile = await Profile.findOne({user: user._id});
    if(!existingProfile) { 
      const profile = new Profile({
        user: user._id,
        bio: "",
        phone: "",
        gender: "",
        dob: null,
        avatar: "",
        location: "",
      });
      await profile.save();
    }

    const token = jwt.sign({
      id: user.id,
      isHost: user.isHost
    }, process.env.JWT_SECRET, {expiresIn: "1d"});        

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        isHost: user.isHost,
        email: user.email  // Added email
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({message: "Server error"});
  }
});

module.exports = router;