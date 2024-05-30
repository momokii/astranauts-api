const Truck = require('../models/truck')
const statusCode = require('../utils/http-response').httpStatus_keyValue
const throw_err = require('../utils/throw-err')

// * -------------------------------- CONTROLLERS

exports.get_info_trucks = async (req, res, next) => {
    try{
        const page = parseInt(req.query.page) || 1 
        const size = parseInt(req.query.per_page) || 10
        const offset = (page - 1) * size 
        let is_active = req.query.is_active || ''
        let total_truck
        let truck

        if(!is_active) {
            total_truck = await Truck.find().countDocuments()
            truck = await Truck.find()
                .select('is_active weight_capacity volume_capacity')
                .skip(offset)
                .limit(size)

        } else {
            if(is_active !== 'true') is_active = false 
            else is_active = true

            total_truck = await Truck.find({
                is_active: is_active
                }).countDocuments()
            truck = await Truck.find({
                is_active: is_active
                })
                .select('is_active weight_capacity volume_capacity')
                .skip(offset)
                .limit(size)
        }

        res.status(statusCode['200_ok']).json({
            errors: false,
            message: "Get Truck Data",
            data: {
                page: page,
                per_page: size,
                total_data: total_truck,
                truck: truck
            }
        })

    } catch (e) {
        if(!e.statusCode){
            e.statusCode = statusCode['500_internal_server_error']
        }
        next(e)
    } 
}



exports.get_info_one_truck = async (req, res, next) => {
    try{
        const id_truck = req.params.id

        const truck = await Truck.findById(id_truck)
        .select('is_active weight_capacity volume_capacity')

        if(!truck) throw_err("Truck not found", statusCode['404_not_found'])

        res.status(statusCode['200_ok']).json({
            errors: false,
            message: "Data truck detail",
            data: truck
        })

    } catch (e) {
        if(!e.statusCode){
            e.statusCode = statusCode['500_internal_server_error']
        }
        next(e)
    } 
}



exports.create_truck = async (req, res, next) => {
    try{
        const weight_capacity = req.body.weight_capacity
        const volume_capacity = req.body.volume_capacity

        const new_truck = new Truck({
            weight_capacity: weight_capacity,
            volume_capacity: volume_capacity
        })

        await new_truck.save()

        res.status(statusCode['200_ok']).json({
            errors: false,
            message: "Success create new truck data"
        })

    } catch (e) {
        if(!e.statusCode){
            e.statusCode = statusCode['500_internal_server_error']
        }
        next(e)
    } 
}



exports.edit_truck = async (req, res, next) => {
    try{
        const new_weight_capacity = req.body.weight_capacity
        const new_volume_capacity = req.body.volume_capacity
        const id_truck = req.body.id_truck

        const truck = await Truck.findById(id_truck)
        if(!truck) throw_err("Truck not found", statusCode['404_not_found'])

        truck.weight_capacity = new_weight_capacity
        truck.volume_capacity = new_volume_capacity

        await truck.save()

        res.status(statusCode['200_ok']).json({
            errors: false,
            message: "Success edit truck data"
        })

    } catch (e) {
        if(!e.statusCode){
            e.statusCode = statusCode['500_internal_server_error']
        }
        next(e)
    } 
}



exports.change_truck_availability = async (req, res, next) => {
    try{
        const id_truck = req.body.id_truck
        
        const truck = await Truck.findById(id_truck)
        if(!truck) throw_err("Truck not found", statusCode['404_not_found'])

        if(truck.is_active) truck.is_active = false
        else truck.is_active = true

        await truck.save()

        res.status(statusCode['200_ok']).json({
            errors: false,
            message: "Success change truck availability status"
        })

    } catch (e) {
        if(!e.statusCode){
            e.statusCode = statusCode['500_internal_server_error']
        }
        next(e)
    } 
}
