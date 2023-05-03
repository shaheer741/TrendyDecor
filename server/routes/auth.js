import express from "express";
const router = express.Router()
import User from '../models/User.js'
import CryptoJS from "crypto-js";
import jwt from "jsonwebtoken"

// REGISTER

router.post('/register', async (req, res) => {
   const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: CryptoJS.AES.encrypt(req.body.password, process.env.PASS_KEY)
   })
   try {
      const savedUser = await newUser.save()
      res.status(200).json(savedUser)
   } catch (err) {
      res.status(500).json(err)
   }
})

// LOGIN
router.post('/login', async (req, res) => {
   try {
      const user = await User.findOne(
         { username: req.body.username }
      )
      !user && res.status(401).json("Wrong username")

      if (user) {
         const inputPassword = req.body.password
         const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.PASS_KEY)
         const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8)


         if (originalPassword != inputPassword) { res.status(401).json("Wrong Password") }
         else {
            const accessToken = jwt.sign(
               {
                  id: user._id,
                  isAdmin: user.isAdmin,
               },
               process.env.JWT_KEY,
               { expiresIn: "3d" }
            );

            const { password, ...others } = user._doc;
            res.status(200).json({ ...others, accessToken });
         }
      }
   }
   catch (err) {
      console.log(err);
   }
});
export default router