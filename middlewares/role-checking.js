const statusCode = require('../utils/http-response').httpStatus_keyValue
const throw_err = require('../utils/throw-err')


exports.is_admin = async (req, res, next) => {
    try {
        if(req.role !== 'admin') throw_err('You are not authorized (not admin)', statusCode['401_unauthorized'])
        
        next()

    } catch(e) {
        if(!e.statusCode) {
            e.statusCode = statusCode['500_internal_server_error']
        }
        
        next(e)
    }
}


exports.is_user_tambang = async (req, res, next) => {
    try {
        if(req.role !== 'user-tambang') throw_err('You are not authorized (not user-tambang)', statusCode['401_unauthorized'])
        
        next()

    } catch(e) {
        if(!e.statusCode) {
            e.statusCode = statusCode['500_internal_server_error']
        }

        next(e)
    }
}


exports.is_user_stockpile = async (req, res, next) => {
    try {
        if(req.role !== 'user-stockpile') throw_err('You are not authorized (not user-stockpile)', statusCode['401_unauthorized'])
        
        next()

    } catch(e) {
        if(!e.statusCode) {
            e.statusCode = statusCode['500_internal_server_error']
        }

        next(e)
    }
}