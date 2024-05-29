const Stockpile = require('../models/stockpiles')
const statusCode = require('../utils/http-response').httpStatus_keyValue
const throw_err = require('../utils/throw-err')

// * -------------------------------- CONTROLLERS

exports.get_info_stockpile = async (req, res, next) => {
    try{
        const page = parseInt(req.query.page) || 1 
        const size = parseInt(req.query.per_page) || 10
        const offset = (page - 1) * size 
        const search = req.query.search || '' // lokasi || nama tambang
        let is_active = req.query.is_active || ''
        let total_stockpile
        let stockpile

        if(!is_active) {
            total_stockpile = await Stockpile.find().countDocuments({
                $or: [
                    { nama_stockpile: { $regex: search, $options: 'i' } },
                    { lokasi: { $regex: search, $options: 'i' } }
                ]
            })
            stockpile = await Stockpile.find({
                $or: [
                    { nama_stockpile: { $regex: search, $options: 'i' } },
                    { lokasi: { $regex: search, $options: 'i' } }
                ]
            })
                .select('is_active nama_stockpile lokasi total_capacity max_capacity longitude latitude coal_id')
                // .populate('coal_id', '_id activity_id cal_value ash_cont moist_cont sulph_cont fc_vm ')
                .skip(offset)
                .limit(size)
            
        } else {
            if(is_active !== 'true') is_active = false 
            else is_active = true

            total_stockpile = await Stockpile.find({
                is_active: is_active,
                $or: [
                    { nama_stockpile: { $regex: search, $options: 'i' } },
                    { lokasi: { $regex: search, $options: 'i' } }
                ]
                }).countDocuments()
            stockpile = await Stockpile.find({
                is_active: is_active,
                $or: [
                    { nama_stockpile: { $regex: search, $options: 'i' } },
                    { lokasi: { $regex: search, $options: 'i' } }
                ]
                })
                .select('is_active nama_stockpile lokasi total_capacity max_capacity longitude latitude coal_id')
                // .populate('coal_id', '_id activity_id cal_value ash_cont moist_cont sulph_cont fc_vm ')
                .skip(offset)
                .limit(size)

        }

        res.status(statusCode['200_ok']).json({
            errors: false,
            message: "Get data stockpile",
            data: {
                page: page,
                per_page: size,
                total_data: total_stockpile,
                stockpile: stockpile
            }
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
        const id_stockpile = req.params.id

        const stockpile = await Stockpile.findById(id_stockpile)
        .select('is_active nama_stockpile lokasi total_capacity max_capacity longitude latitude coal_id')
        // .populate('coal_id', '_id activity_id cal_value ash_cont moist_cont sulph_cont fc_vm ')

        if(!stockpile) throw_err("Stockpile not found", statusCode['404_not_found'])

        res.status(statusCode['200_ok']).json({
            errors: false,
            message: "Success get one stockpile data",
            data: stockpile
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
        const nama_stockpile = req.body.nama_stockpile
        const lokasi = req.body.lokasi
        const longitude = req.body.longitude
        const latitude = req.body.latitude
        const total_capacity = req.body.total_capacity
        const max_capacity = req.body.max_capacity

        const stockpile_new = new Stockpile({
            nama_stockpile: nama_stockpile,
            lokasi: lokasi,
            longitude: longitude,
            latitude: latitude,
            total_capacity: total_capacity,
            max_capacity: max_capacity
        })

        await stockpile_new.save()

        res.status(statusCode['200_ok']).json({
            errors: false,
            message: "Success add new stockpile data"
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
        const new_nama_stockpile = req.body.nama_stockpile
        const new_lokasi = req.body.lokasi
        const new_longitude = req.body.longitude
        const new_latitude = req.body.latitude
        const new_total_capacity = req.body.total_capacity
        const new_max_capacity = req.body.max_capacity
        const id_stockpile = req.body.id_stockpile

        const stockpile = await Stockpile.findById(id_stockpile)
        if(!stockpile) throw_err("Stockpile not found", statusCode['404_not_found'])

        stockpile.nama_stockpile = new_nama_stockpile
        stockpile.lokasi = new_lokasi
        stockpile.longitude = new_longitude
        stockpile.latitude = new_latitude
        stockpile.total_capacity = new_total_capacity
        stockpile.max_capacity = new_max_capacity

        await stockpile.save()

        res.status(statusCode['200_ok']).json({
            errors: false,
            message: "Success edit stockpile data"
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
        const id_stockpile = req.body.id_stockpile

        const stockpile = await Stockpile.findById(id_stockpile)
        if(!stockpile) throw_err("Stockpile not found", statusCode['404_not_found'])

        if(stockpile.is_active) stockpile.is_active = false
        else stockpile.is_active = true

        await stockpile.save()

        res.status(statusCode['200_ok']).json({
            errors: false,
            message: "Success change stockpile status"
        })
    } catch (e) {
        if(!e.statusCode){
            e.statusCode = statusCode['500_internal_server_error']
        }
        next(e)
    }
}