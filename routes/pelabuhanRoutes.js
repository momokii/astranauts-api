const router = require('express').Router()
const is_auth = require('../middlewares/is-auth')
const is_admin = require('../middlewares/role-checking').is_admin
const pelabuhanController = require('../controllers/pelabuhanControllers')

// * -------------------------------- routing

router.get('/', is_auth, is_admin, pelabuhanController.get_info_one_pelabuhan)

router.get('/:id', is_auth, is_admin, pelabuhanController.get_info_one_pelabuhan)

router.post('/', is_auth, is_admin, pelabuhanController.create_pelabuhan)

router.patch('/', is_auth, is_admin, pelabuhanController.edit_pelabuhan)

router.patch('/availability', is_auth, is_admin, pelabuhanController.change_pelabuhan_status)

module.exports = router