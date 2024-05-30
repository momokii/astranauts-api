const Coal = require('../models/coal')
const Activity = require('../models/activity')
const statusCode = require('../utils/http-response').httpStatus_keyValue
const throw_err = require('../utils/throw-err')


// * -------------------------------- CONTROLLERS


exports.get_info_coal = async (req, res, next) => {
    try{
        const page = parseInt(req.query.page) || 1 
        const size = parseInt(req.query.per_page) || 10
        const offset = (page - 1) * size 
        let total_coal
        let coal
        const is_admin = req.role === 'admin'
        const is_deleted = req.query.is_deleted === 'true'

        const query = {}

        if(is_deleted) query.is_deleted = true
        else query.is_deleted = false

        total_coal = await Coal.find(query)
        .select('activity_id cal_value ash_cont moist_cont sulph_cont fc_vm is_deleted')
        .populate('activity_id', 'id_tambang layer is_active waktu_mulai waktu_selesai created_by is_deleted')

        coal = await Coal.find(query)
        .select('activity_id cal_value ash_cont moist_cont sulph_cont fc_vm is_deleted')
        .populate('activity_id', 'id_tambang layer is_active waktu_mulai waktu_selesai created_by is_deleted')
        .skip(offset)
        .limit(size)

        let dataCoal = coal.map(coal => {
            const newCoal = {
                ...coal._doc,
                activity: coal.activity_id,
            };
            delete newCoal.activity_id;
            return newCoal;
        })

        if(!is_admin) {
            dataCoal = dataCoal.filter(coal => {
                return coal.activity.created_by._id.toString() === req.userId
            })

            total_coal = total_coal.filter(coal => {
                return coal.activity_id.created_by._id.toString() === req.userId
            })
            total_coal = total_coal.length
        }        

        res.status(statusCode['200_ok']).json({
            errors: false,
            message: 'Get data coal',
            data: {
                page: page,
                per_page: size,
                total_data: total_coal,
                coal: dataCoal
            }
        })

    } catch(e) {
        if(!e.statusCode){
            e.statusCode = statusCode['500_internal_server_error']
        }
        next(e)
    }
}



exports.get_info_coal_one = async (req, res, next) => {
    try{
        const coal_id = req.params.id
        const coal = await Coal.findById(coal_id)
        .select('activity_id cal_value ash_cont moist_cont sulph_cont fc_vm')

        if(!coal) throw_err("Coal not found", statusCode['404_not_found'])

        const activity = await Activity.findById(coal.activity_id)
        .select('id_tambang layer is_active waktu_mulai waktu_selesai created_by is_deleted')
        .populate('created_by', 'username name')
        .populate('id_tambang', '_id nama_tambang lokasi longitude latitude jumlah_layer is_active')
        .lean()
        
        if((activity.created_by._id.toString() !== req.userId) && (req.role !== 'admin')) throw_err("You are not authorized to access this coal data", statusCode['401_unauthorized'])

        const coal_data = {
            ...coal._doc,
            activity: activity
        }
        delete coal_data.activity_id

        coal_data.activity.tambang = coal_data.activity.id_tambang
        delete coal_data.activity.id_tambang

        res.status(statusCode['200_ok']).json({
            errors: false,
            message: 'Get coal data',
            data: coal_data
        })
    } catch(e) {
        if(!e.statusCode){
            e.statusCode = statusCode['500_internal_server_error']
        }
        next(e)
    }
}



exports.create_coal = async (req, res, next) => {
    try{
        const activity_id = req.body.activity_id
        const cal_value = req.body.cal_value
        const ash_cont = req.body.ash_cont
        const moist_cont = req.body.moist_cont
        const sulph_cont = req.body.sulph_cont
        const fc_vm = req.body.fc_vm

        const check_activity = await Activity.findById(activity_id)
        if(!check_activity || check_activity.is_deleted) throw_err("Activity not found", statusCode['404_not_found'])

        if(!check_activity.is_active) throw_err("Activity is not active", statusCode['400_bad_request'])

        if(check_activity.created_by.toString() !== req.userId) throw_err("You are not authorized to create coal data in this activity", statusCode['401_unauthorized'])

        const new_coal = new Coal({
            activity_id: activity_id,
            cal_value: cal_value,
            ash_cont: ash_cont,
            moist_cont: moist_cont,
            sulph_cont: sulph_cont,
            fc_vm: fc_vm
        })

        await new_coal.save()

        res.status(statusCode['200_ok']).json({
            errors: false,
            message: 'Success create new coal data'
        })
    } catch(e) {
        if(!e.statusCode){
            e.statusCode = statusCode['500_internal_server_error']
        }
        next(e)
    }
}



exports.edit_coal = async (req, res, next) => {
    try{
        const activity_id = req.body.activity_id
        const cal_value = req.body.cal_value
        const ash_cont = req.body.ash_cont
        const moist_cont = req.body.moist_cont
        const sulph_cont = req.body.sulph_cont
        const fc_vm = req.body.fc_vm
        const coal_id = req.body.id_coal

        const coal = await Coal.findById(coal_id)
        if(!coal) throw_err("Coal not found", statusCode['404_not_found'])

        const check_activity_access = await Activity.findById(coal.activity_id)
        if(check_activity_access.created_by.toString() !== req.userId) throw_err("You are not authorized to edit this coal data", statusCode['401_unauthorized'])

        const check_activity = await Activity.findById(activity_id)
        if(!check_activity || check_activity.is_deleted) throw_err("Activity not found", statusCode['404_not_found'])

        if(!check_activity.is_active) throw_err("Activity is not active", statusCode['400_bad_request'])

        if(check_activity.is_deleted) throw_err("Activity is deleted", statusCode['400_bad_request'])

        if(check_activity.created_by.toString() !== req.userId) throw_err("You are not authorized to edit this coal data", statusCode['401_unauthorized'])

        coal.activity_id = activity_id
        coal.cal_value = cal_value
        coal.ash_cont = ash_cont
        coal.moist_cont = moist_cont
        coal.sulph_cont = sulph_cont
        coal.fc_vm = fc_vm

        await coal.save()

        res.status(statusCode['200_ok']).json({
            errors: false,
            message: 'Success edit coal data'
        })
    } catch(e) {
        if(!e.statusCode){
            e.statusCode = statusCode['500_internal_server_error']
        }
        next(e)
    }
}



exports.delete_coal = async (req, res, next) => {
    try{
        const coal_id = req.body.id_coal
        const coal = await Coal.findById(coal_id)
        if(!coal) throw_err("Coal not found", statusCode['404_not_found'])
        
        const activity = await Activity.findById(coal.activity_id)
        if(activity.created_by.toString() !== req.userId) throw_err("You are not authorized to delete coal data", statusCode['401_unauthorized'])

        if(activity.is_deleted) throw_err("Activity is deleted", statusCode['400_bad_request'])

        if(!activity.is_active) throw_err("Activity is not active, can't delete coal data", statusCode['400_bad_request'])

        if(coal.is_deleted) coal.is_deleted = false
        else coal.is_deleted = true

        await coal.save()

        res.status(statusCode['200_ok']).json({
            errors: false,
            message: 'Success delete coal data'
        })
    } catch(e) {
        if(!e.statusCode){
            e.statusCode = statusCode['500_internal_server_error']
        }
        next(e)
    }
}