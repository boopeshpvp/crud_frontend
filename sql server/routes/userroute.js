const express=require('express')
const router=express.Router()
const userController=require('../controllers/usercontroller')

router.post('/addUser',userController.addUser)
router.get('/getuserlist',userController.getUser)
router.patch('/edituser/:id',userController.editUser)
router.delete('/deleteuser/:id',userController.deleteuser)

module.exports=router