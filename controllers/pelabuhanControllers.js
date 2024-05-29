const Pelabuhan = require('../models/pelabuhan')
const statusCode = require('../utils/http-response').httpStatus_keyValue
const throw_err = require('../utils/throw-err')

// * -------------------------------- CONTROLLERS

exports.get_info_pelabuhan = async (req, res, next) => {
    try{
        const page = parseInt(req.query.page) || 1 
        const size = parseInt(req.query.per_page) || 10
        const offset = (page - 1) * size 
        const search = req.query.search || '' // lokasi || nama tambang
        let is_active = req.query.is_active || ''
        let total_pelabuhan
        let pelabuhan

        if(!is_active){
            total_pelabuhan = await Pelabuhan.find().countDocuments({
                $or: [
                    { nama_pelabuhan: { $regex: search, $options: 'i' } },
                    { lokasi: { $regex: search, $options: 'i' } }
                ]
            })
            pelabuhan = await Pelabuhan.find({
                $or: [
                    { nama_pelabuhan: { $regex: search, $options: 'i' } },
                    { lokasi: { $regex: search, $options: 'i' } }
                ]
            })
            .select('is_active nama_pelabuhan lokasi longitude latitude')
            .skip(offset)
            .limit(size)

        } else {
            if(is_active !== 'true') is_active = false
            else is_active = true

            total_pelabuhan = await Pelabuhan.find().countDocuments({
                is_active: is_active,
                $or: [
                    { nama_pelabuhan: { $regex: search, $options: 'i' } },
                    { lokasi: { $regex: search, $options: 'i' } }
                ]
            })
            pelabuhan = await Pelabuhan.find({
                is_active: is_active,
                $or: [
                    { nama_pelabuhan: { $regex: search, $options: 'i' } },
                    { lokasi: { $regex: search, $options: 'i' } }
                ]
            })
            .select('is_active nama_pelabuhan lokasi longitude latitude')
            .skip(offset)
            .limit(size)
        }

        res.status(statusCode['200_ok']).json({
            errors: false,
            message: "Get pelabuhan data",
            data: {
                page: page,
                per_page: size,
                total_data: total_pelabuhan,
                pelabuhan: pelabuhan
            }
        })
    } catch (e) {
        if(!e.statusCode){
            e.statusCode = statusCode['500_internal_server_error']
        }
        next(e)
    }
}



exports.get_info_one_pelabuhan = async (req, res, next) => {
    try{
        const id_pelabuhan = req.params.id

        const pelabuhan = await Pelabuhan.findById(id_pelabuhan)
        .select('is_active nama_pelabuhan lokasi longitude latitude')

        if(!pelabuhan) throw_err("Pelabuhan not found", statusCode['404_not_found'])

        res.status(statusCode['200_ok']).json({
            errors: false,
            message: "Data pelabuhan detail",
            data: pelabuhan
        })
    } catch (e) {
        if(!e.statusCode){
            e.statusCode = statusCode['500_internal_server_error']
        }
        next(e)
    }
}



exports.create_pelabuhan = async (req, res, next) => {
    try{
        const nama_pelabuhan = req.body.nama_pelabuhan
        const lokasi = req.body.lokasi
        const longitude = req.body.longitude
        const latitude = req.body.latitude
        
        const new_pelabuhan = new Pelabuhan({
            nama_pelabuhan: nama_pelabuhan,
            lokasi: lokasi,
            longitude: longitude,
            latitude: latitude
        })

        await new_pelabuhan.save()

        res.status(statusCode['200_ok']).json({
            errors: false,
            message: "Success add new pelabuhan data"
        })
    } catch (e) {
        if(!e.statusCode){
            e.statusCode = statusCode['500_internal_server_error']
        }
        next(e)
    }
}



exports.edit_pelabuhan = async (req, res, next) => {
    try{
        const new_nama_pelabuhan = req.body.nama_pelabuhan
        const new_lokasi = req.body.lokasi
        const new_longitude = req.body.longitude
        const new_latitude = req.body.latitude
        const id_pelabuhan = req.body.id_pelabuhan

        const pelabuhan = await Pelabuhan.findById(id_pelabuhan)
        if(!pelabuhan) throw_err("Pelabuhan not found", statusCode['404_not_found'])

        pelabuhan.nama_pelabuhan = new_nama_pelabuhan
        pelabuhan.lokasi = new_lokasi
        pelabuhan.longitude = new_longitude
        pelabuhan.latitude = new_latitude

        await pelabuhan.save()

        res.status(statusCode['200_ok']).json({
            errors: false,
            message: "Success edit pelabuhan data"
        })
    } catch (e) {
        if(!e.statusCode){
            e.statusCode = statusCode['500_internal_server_error']
        }
        next(e)
    }
}



exports.change_pelabuhan_status = async (req, res, next) => {
    try{
        const id_pelabuhan = req.body.id_pelabuhan

        const pelabuhan = await Pelabuhan.findById(id_pelabuhan)
        if(!pelabuhan) throw_err("Pelabuhan not found", statusCode['404_not_found'])

        if(pelabuhan.is_active) pelabuhan.is_active = false
        else pelabuhan.is_active = true

        await pelabuhan.save()

        res.status(statusCode['200_ok']).json({
            errors: false,
            message: "Success change pelabuhan status"
        })
    } catch (e) {
        if(!e.statusCode){
            e.statusCode = statusCode['500_internal_server_error']
        }
        next(e)
    }
}