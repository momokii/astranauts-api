const router = require('express').Router()
const authController = require('../controllers/authControllers')

// * -------------------------------- routing

router.post('/auth/login', authController.login)

module.exports = router