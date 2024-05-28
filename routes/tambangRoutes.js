const router = require('express').Router()
const is_auth = require('../middlewares/is-auth')
const is_admin = require('../middlewares/role-checking').is_admin
const tambangController = require('../controllers/tambangControllers')

// * -------------------------------- routing

router.get('/', is_auth, is_admin, tambangController.get_info_tambang)

router.get('/:id', is_auth, is_admin, tambangController.get_info_one_tambang)

router.post('/', is_auth, is_admin, tambangController.create_tambang)

router.patch('/', is_auth, is_admin, tambangController.edit_tambang)

router.patch('/availability', is_auth, is_admin, tambangController.change_tambang_status)

module.exports = router