const express=require('express');
const router=express.Router()
const authController = require('../controllers/authcontroller');


router.post('/',authController.registerDetails)
router.post('/login',authController.loginDetails)

module.exports=router;