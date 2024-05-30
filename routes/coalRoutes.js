const router = require('express').Router()
const is_auth = require('../middlewares/is-auth')
const is_tambang = require('../middlewares/role-checking').is_user_tambang
const except_stockpile = require('../middlewares/role-checking').except_user_stockpile
const coalController = require('../controllers/coalControllers')

// * -------------------------------- routing

router.get('/', is_auth, except_stockpile, coalController.get_info_coal)

router.get('/:id', is_auth, except_stockpile, coalController.get_info_coal_one)

router.post('/', is_auth, is_tambang, coalController.create_coal)

router.patch('/', is_auth, is_tambang, coalController.edit_coal)

router.patch('/delete', is_auth, is_tambang, coalController.delete_coal)

module.exports = router