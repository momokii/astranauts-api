const router = require('express').Router()
const is_auth = require('../middlewares/is-auth')
const is_admin = require('../middlewares/role-checking').is_admin
const stockpileController = require('../controllers/stockpileControllers')

// * -------------------------------- routing

router.get('/', is_auth, stockpileController.get_info_stockpile)

router.get('/:id', is_auth, stockpileController.get_info_one_stockpile)

router.post('/', is_auth, is_admin, stockpileController.create_stockpile)

router.patch('/', is_auth, is_admin, stockpileController.edit_stockpile)

router.patch('/availability', is_auth, is_admin, stockpileController.change_stockpile_status)

module.exports = router