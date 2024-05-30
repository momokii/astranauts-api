const router = require('express').Router()
const is_auth = require('../middlewares/is-auth')
const is_tambang = require('../middlewares/role-checking').is_user_tambang
const except_stockpile = require('../middlewares/role-checking').except_user_stockpile
const activityController = require('../controllers/activityControllers')

// * -------------------------------- routing

router.get('/', is_auth, except_stockpile, activityController.get_info_activity)

router.get('/:id', is_auth, except_stockpile, activityController.get_one_activity)

router.post('/', is_auth, is_tambang, activityController.create_activity)

router.patch('/', is_auth, is_tambang, activityController.edit_activity)

router.patch('/active', is_auth, is_tambang, activityController.change_status_activity)

router.patch('/delete', is_auth, is_tambang, activityController.delete_activity)

module.exports = router