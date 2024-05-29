const Tambang = require('../models/tambang')
const statusCode = require('../utils/http-response').httpStatus_keyValue
const throw_err = require('../utils/throw-err')

// * -------------------------------- CONTROLLERS

exports.get_info_tambang = async (req, res, next) => {
    try{
        const page = parseInt(req.query.page) || 1 
        const size = parseInt(req.query.per_page) || 10
        const offset = (page - 1) * size 
        const search = req.query.search || '' // lokasi || nama tambang
        let is_active = req.query.is_active || ''
        let total_tambang
        let tambang

        if(!is_active) {
            total_tambang = await Tambang.find().countDocuments({
                $or: [
                    { nama_tambang: { $regex: search, $options: 'i' } },
                    { lokasi: { $regex: search, $options: 'i' } }
                ]
            })
            tambang = await Tambang.find({
                $or: [
                    { nama_tambang: { $regex: search, $options: 'i' } },
                    { lokasi: { $regex: search, $options: 'i' } }
                ]
            })
                .select('is_active nama_tambang lokasi jumlah_layer longitude latitude')
                .skip(offset)
                .limit(size)
        } else {
            if(is_active !== 'true') is_active = false 
            else is_active = true

            total_tambang = await Tambang.find({
                is_active: is_active,
                $or: [
                    { nama_tambang: { $regex: search, $options: 'i' } },
                    { lokasi: { $regex: search, $options: 'i' } }
                ]
                }).countDocuments()
            tambang = await Tambang.find({
                is_active: is_active,
                $or: [
                    { nama_tambang: { $regex: search, $options: 'i' } },
                    { lokasi: { $regex: search, $options: 'i' } }
                ]
                })
                .select('is_active nama_tambang lokasi jumlah_layer longitude latitude')
                .skip(offset)
                .limit(size)
        }

        res.status(statusCode['200_ok']).json({
            errors: false,
            message: "Get tambang Data",
            data: {
                page: page,
                per_page: size,
                total_data: total_tambang,
                tambang: tambang
            }
        })
    } catch (e) {
        if(!e.statusCode){
            e.statusCode = statusCode['500_internal_server_error']
        }
        next(e)
    }
}



exports.get_info_one_tambang = async (req, res, next) => {
    try{
        const id_tambang = req.params.id

        const tambang = await Tambang.findById(id_tambang)
        .select('is_active nama_tambang lokasi jumlah_layer longitude latitude')

        if(!tambang) throw_err("Tambang not found", statusCode['404_not_found'])

        res.status(statusCode['200_ok']).json({
            errors: false,
            message: "Data tambang detail",
            data: tambang
        })
    } catch (e) {
        if(!e.statusCode){
            e.statusCode = statusCode['500_internal_server_error']
        }
        next(e)
    }
}



exports.create_tambang = async (req, res, next) => {
    try{
        const nama_tambang = req.body.nama_tambang
        const lokasi = req.body.lokasi
        const longitude = req.body.longitude
        const latitude = req.body.latitude
        const jumlah_layer = req.body.jumlah_layer

        const new_tambang = new Tambang({
            nama_tambang: nama_tambang,
            lokasi: lokasi,
            longitude: longitude,
            latitude: latitude,
            jumlah_layer: jumlah_layer
        })

        await new_tambang.save()

        res.status(statusCode['200_ok']).json({
            errors: false,
            message: "Success add new tambang data"
        })
    } catch (e) {
        if(!e.statusCode){
            e.statusCode = statusCode['500_internal_server_error']
        }
        next(e)
    }
}



exports.edit_tambang = async (req, res, next) => {
    try{
        const new_nama_tambang = req.body.nama_tambang
        const new_lokasi = req.body.lokasi
        const new_longitude = req.body.longitude
        const new_latitude = req.body.latitude
        const new_jumlah_layer = req.body.jumlah_layer
        const tambang_id = req.body.id_tambang

        const tambang = await Tambang.findById(tambang_id)
        if(!tambang) throw_err("Tambang not found", statusCode['404_not_found'])

        tambang.nama_tambang = new_nama_tambang
        tambang.lokasi = new_lokasi
        tambang.longitude = new_longitude
        tambang.latitude = new_latitude
        tambang.jumlah_layer = new_jumlah_layer

        await tambang.save()

        res.status(statusCode['200_ok']).json({
            errors: false,
            message: "Success edit tambang data"
        })
    } catch (e) {
        if(!e.statusCode){
            e.statusCode = statusCode['500_internal_server_error']
        }
        next(e)
    }
}



exports.change_tambang_status = async (req, res, next) => {
    try{
        const id_tambang = req.body.id_tambang

        const tambang = await Tambang.findById(id_tambang)
        if(!tambang) throw_err("Tambang not found", statusCode['404_not_found'])

        if(tambang.is_active) tambang.is_active = false
        else tambang.is_active = true

        await tambang.save()

        res.status(statusCode['200_ok']).json({
            errors: false,
            message: "Success change tambang status"
        })
    } catch (e) {
        if(!e.statusCode){
            e.statusCode = statusCode['500_internal_server_error']
        }
        next(e)
    }
}