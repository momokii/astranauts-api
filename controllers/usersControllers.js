const User = require('../models/users')
const statusCode = require('../utils/http-response').httpStatus_keyValue
const bcrypt = require('bcrypt')
const { validationResult }  = require('express-validator')
const throw_err = require('../utils/throw-err')

// * -------------------------------- CONTROLLERS

exports.check_username = async (req, res, next) => {
    try{
        let username_avail = true
        const username_check = req.query.username
        const response = {
            errors: false,
            message: 'Info username availability',
            data: {
                username: username_check,
                availability: username_avail
            }
        }

        if(!username_check){
            response.data.username = null
            response.data.availability = null
            return res.status(statusCode['200_ok']).json(response)
        }

        const user_check = await User.findOne({
            username : username_check
        })

        if(user_check && req.username !== user_check.username){
            response.data.availability = false
        }

        res.status(statusCode['200_ok']).json(response)

    } catch (e) {
        if(!e.statusCode){
            e.statusCode = statusCode['500_internal_server_error']
        }
        next(e)
    }
}





exports.get_info_users = async(req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1 
        const size = parseInt(req.query.per_page) || 10
        const offset = (page - 1) * size 
        const search = req.query.search || ''
        const user_type = req.query.user_type || ''

        const total_user = await User.find({
            username: { $regex: search, $options: 'i' },
            
            role: { $regex: user_type, $options: 'i' }
            }).countDocuments()
        const user = await User.find({
            username: { $regex: search, $options: 'i' },
            role: { $regex: user_type, $options: 'i' }
            })
            .select("username name role is_active")
            .skip(offset)
            .limit(size)

        if(!user){
            throw_err("Token Error, User tidak ditemukan", statusCode['404_not_found'])
        }

        res.status(statusCode['200_ok']).json({
            errors: false,
            message : "Info user detail",
            data: {
                page: page,
                per_page: size,
                total_data: total_user,
                users: user
            }
        })

    } catch (e) {
        if(e.statusCode){
            e.statusCode = statusCode['500_internal_server_error']
        }
        next(e)
    }
}





exports.get_info_self = async(req, res, next) => {
    try {
        const user = await User.findById(req.userId)
            .select("username name role is_active")

        if(!user){
            throw_err("Token Error, User tidak ditemukan", statusCode['404_not_found'])
        }

        res.status(statusCode['200_ok']).json({
            errors: false,
            message : "Info user detail",
            data: user
        })

    } catch (e) {
        if(e.statusCode){
            e.statusCode = statusCode['500_internal_server_error']
        }
        next(e)
    }
}





exports.get_info = async (req, res, next) => {
    try{
        let user = await User.findOne({
            username: req.params.username
        })
            .select('username name role is_active')

        if(!user){
            throw_err("User tidak ditemukan", statusCode['404_not_found'])
        }

        res.status(statusCode['200_ok']).json({
            errors: false,
            message: 'Info User',
            data: user
        })

    } catch (e) {
        if(!e.statusCode){
            e.statusCode = statusCode['500_internal_server_error']
        }
        next(e)
    }
}





exports.change_password = async (req, res, next) => {
    try{
        const val_err = validationResult(req)
        if(!val_err.isEmpty()){
            const msg = val_err.array()[0].msg
            throw_err(msg, statusCode['400_bad_request'])
        }

        const user = await User.findById(req.userId)
        if(!user){
            throw_err('Token tidak valid/ User tidak punya akses', statusCode['401_unauthorized'])
        }

        const compare_oldpass = await bcrypt.compare(req.body.password_now, user.password)
        if(!compare_oldpass){
            throw_err("Password lama tidak sesuai dengan password akun", statusCode['400_bad_request'])
        }

        const new_pass = await bcrypt.hash(req.body.new_password, 16)
        user.password = new_pass

        await user.save()

        res.status(statusCode['200_ok']).json({
            errors: false,
            message: "User sukses ganti password"
        })

    } catch (e) {
        if(!e.statusCode){
            e.statusCode = statusCode['500_internal_server_error']
        }
        next(e)
    }
}




exports.create_user = async (req, res, next) => {
    try{
        const err_val = validationResult(req)
        if(!err_val.isEmpty()){
            const err_view = err_val.array()[0].msg
            const err = new Error('Add new user Failed - ' + err_view)
            err.statusCode = statusCode['400_bad_request']
            throw err
        }

        const username = req.body.username
        const password = req.body.password
        const hash_password = await bcrypt.hash(password, 16)
        const name = req.body.name
        const role = req.body.role

        const new_user = new User({
            username : username,
            password : hash_password,
            name : name,
            role: role
        })

        await new_user.save()

        res.status(statusCode['200_ok']).json({
            errors: false,
            message: 'Success create new account'
        })

    } catch (e) {
        if(!e.statusCode) {
            e.statusCode = statusCode['500_internal_server_error']
        }
        next(e)
    }
}