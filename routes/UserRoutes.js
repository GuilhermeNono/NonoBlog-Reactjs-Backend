const express = require('express')
const router = express.Router()

//Controller 
const {register, login, getCurrentUser, update, getUserById} = require('../controllers/UserController')

//MiddleWares
const {authGuard} = require("../middlewares/authGuard")
const {validate} = require('../middlewares/handleValidation');
const { imageUpload } = require('../middlewares/imageUpload');
const {userCreateValidation, loginValidation, userUpdateValidation} = require('../middlewares/userValidations')

router.post("/register",userCreateValidation(), validate, register)
router.post("/login",loginValidation(), validate, login)
router.get("/profile",authGuard, getCurrentUser)
router.put("/",authGuard, userUpdateValidation(), validate, imageUpload.single("profileImage"), update)
router.get("/:id", getUserById)

module.exports = router;