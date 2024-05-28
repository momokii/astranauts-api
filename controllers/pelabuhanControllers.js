const Pelabuhan = require('../models/pelabuhan')
const statusCode = require('../utils/http-response').httpStatus_keyValue
const throw_err = require('../utils/throw-err')

// * -------------------------------- CONTROLLERS

exports.get_info_pelabuhan = async (req, res, next) => {
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



exports.get_info_one_pelabuhan = async (req, res, next) => {
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



exports.create_pelabuhan = async (req, res, next) => {
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



exports.edit_pelabuhan = async (req, res, next) => {
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



exports.change_pelabuhan_status = async (req, res, next) => {
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