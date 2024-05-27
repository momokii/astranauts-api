require('dotenv').config()
const User = require('../models/users')
const statusCode = require('../utils/http-response').httpStatus_keyValue
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// * -------------------------------- CONTROLLERS


exports.login = async (req, res, next) => {
    try{
        const username = req.body.username
        const password = req.body.password

        const user = await User.findOne({
            username: username
        })
        if(!user){
            throw_err('Wrong Username / Password', statusCode['400_bad_request'])
        }

        const check_pass = await bcrypt.compare(password, user.password)
        if(!check_pass){
            throw_err("Wrong Username / Password", statusCode['400_bad_request'])
        }
        
        const access_token = jwt.sign({
            userId: user._id.toString()
        }, process.env.JWT_SECRET, {
            expiresIn: '30d'
        })

        await user.save()

        res.status(statusCode['200_ok']).json({
            errors: false,
            message: 'Login Success',
            data: {
                access_token : access_token,
                token_type: 'Bearer'
            }
        })

    } catch (e) {
        if(!e.statusCode){
            e.statusCode = statusCode['500_internal_server_error']
        }
        next(e)
    }
}