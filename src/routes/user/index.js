const express = require('express')
const UserController = require('../../controllers/user.controller')
const { asyncHandler } = require('../../middlewares')
const { authentication } = require('../../auth')
const router = express.Router()

router.post('/signup', asyncHandler(UserController.signup))
router.post('/login', asyncHandler(UserController.login))
router.post('/forgotPassword', asyncHandler(UserController.forgotPassword))
router.get('/reset', asyncHandler(UserController.resetPassword))
router.post('/reset', asyncHandler(UserController.changePassword))

router.use(asyncHandler(authentication))

router.get('/logout', asyncHandler(UserController.logout))
router.get('/handlerRefreshToken', asyncHandler(UserController.handlerRefreshToken))


module.exports = router