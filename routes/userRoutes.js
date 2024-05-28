const router = require('express').Router()
const is_auth = require('../middlewares/is-auth')
const User = require('../models/users')
const userController = require('../controllers/usersControllers')
const { body }  = require('express-validator')
const statusCode = require('../utils/http-response').httpStatus_keyValue
const throw_err = require('../utils/throw-err')
const is_admin = require('../middlewares/role-checking').is_admin

// * -------------------------------- routing

router.get('/', is_auth, is_admin, userController.get_info_users)

router.get('/check-username', is_auth, userController.check_username)

router.get('/self', is_auth, userController.get_info_self)

router.get('/:username', is_auth, is_admin, userController.get_info)

router.post('/', is_auth, is_admin, [
    body('username', 'Username sudah digunakan, coba username lain')
        .isAlphanumeric()
        .isLength({min: 5})
        .custom((value, {req}) => {
            return (async () => {
                const user = await User.findOne({
                    username : value
                })
                if(user){
                    throw_err(
                        "Username sudah digunakan, coba username lain",
                        statusCode['401_unauthorized'] )
                }
            })()
        }),
    body('password', "Password harus setidaknya gunakan 1 angka dan huruf kapital dengan minimal panjang 6 Karakter")
        .isStrongPassword({
            minLength: 6,
            minNumbers: 1,
            minUppercase: 1,
            minSymbols: 0
        })
], userController.create_user)

router.patch('/self/password', is_auth, [
    body('new_password', "Password harus setidaknya gunakan 1 angka dan huruf kapital dengan minimal panjang 6 Karakter")
        .isStrongPassword({
            minLength: 6,
            minNumbers: 1,
            minUppercase: 1,
            minSymbols: 0
        })
],userController.change_password)



module.exports = router