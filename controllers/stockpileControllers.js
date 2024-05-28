const Stockpile = require('../models/stockpiles')
const statusCode = require('../utils/http-response').httpStatus_keyValue
const throw_err = require('../utils/throw-err')

// * -------------------------------- CONTROLLERS

exports.get_info_stockpile = async (req, res, next) => {
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



exports.get_info_one_stockpile = async (req, res, next) => {
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



exports.create_stockpile = async (req, res, next) => {
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



exports.edit_stockpile = async (req, res, next) => {
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



exports.change_stockpile_status = async (req, res, next) => {
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