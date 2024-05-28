const Tambang = require('../models/tambang')
const statusCode = require('../utils/http-response').httpStatus_keyValue
const throw_err = require('../utils/throw-err')

// * -------------------------------- CONTROLLERS

exports.get_info_tambang = async (req, res, next) => {
    try{

        res.status(statusCode['200_ok']).json({
            errors: false,
            message: ""
        })
    } catch (e) {
        if(!e.statusCode){
            e.statusCode = statusCode['500_internal_server_error']
        }
        next(e)
    }
}



exports.get_info_one_tambang = async (req, res, next) => {
    try{

        res.status(statusCode['200_ok']).json({
            errors: false,
            message: ""
        })
    } catch (e) {
        if(!e.statusCode){
            e.statusCode = statusCode['500_internal_server_error']
        }
        next(e)
    }
}



exports.create_tambang = async (req, res, next) => {
    try{

        res.status(statusCode['200_ok']).json({
            errors: false,
            message: ""
        })
    } catch (e) {
        if(!e.statusCode){
            e.statusCode = statusCode['500_internal_server_error']
        }
        next(e)
    }
}



exports.edit_tambang = async (req, res, next) => {
    try{

        res.status(statusCode['200_ok']).json({
            errors: false,
            message: ""
        })
    } catch (e) {
        if(!e.statusCode){
            e.statusCode = statusCode['500_internal_server_error']
        }
        next(e)
    }
}



exports.change_tambang_status = async (req, res, next) => {
    try{

        res.status(statusCode['200_ok']).json({
            errors: false,
            message: ""
        })
    } catch (e) {
        if(!e.statusCode){
            e.statusCode = statusCode['500_internal_server_error']
        }
        next(e)
    }
}