const router = require('express').Router()
const is_auth = require('../middlewares/is-auth')
const is_admin = require('../middlewares/role-checking').is_admin
const truckController = require('../controllers/truckControllers')


// * -------------------------------- routing


router.get('/', is_auth, is_admin, truckController.get_info_trucks)

router.get('/:id', is_auth, is_admin, truckController.get_info_one_truck)

router.post('/', is_auth, is_admin, truckController.create_truck)

router.patch('/', is_auth, is_admin, truckController.edit_truck)

router.patch('/availability', is_auth, is_admin, truckController.change_truck_availability)

module.exports = router