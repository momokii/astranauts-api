const Activity = require('../models/activity')
const Tambang = require('../models/tambang')
const Coal = require('../models/coal')
const statusCode = require('../utils/http-response').httpStatus_keyValue
const throw_err = require('../utils/throw-err')


// * -------------------------------- CONTROLLERS
exports.get_info_activity = async (req, res, next) => {
    try{
        const page = parseInt(req.query.page) || 1 
        const size = parseInt(req.query.per_page) || 10
        const offset = (page - 1) * size 
        let is_active = req.query.is_active || ''
        let total_activity
        let activity
        const is_admin = req.role === 'admin'
        const is_deleted = req.query.is_deleted === 'true'

        const query = {}
        if (!is_admin) query.created_by = req.userId;

        if(is_active) {
            if(is_active !== 'true') is_active = false 
            else is_active = true

            query.is_active = is_active
        }

        if(is_deleted) query.is_deleted = true
        else query.is_deleted = false
        
        total_activity = await Activity.find(query).countDocuments()
        activity = await Activity.find(query)
            .select('id_tambang layer is_active waktu_mulai waktu_selesai created_by is_deleted')
            .populate('created_by', 'username name')
            .populate('id_tambang', '_id nama_tambang lokasi longitude latitude jumlah_layer is_active')
            .skip(offset)
            .limit(size)
        
        const modifiedActivities = activity.map(activity => {
            const newActivity = {
                ...activity._doc,
                tambang: activity.id_tambang,
            };
            delete newActivity.id_tambang;
            return newActivity;
        });

        res.status(statusCode['200_ok']).json({
            errors: false,
            message: "Get data activity",
            data: {
                page: page,
                per_page: size,
                total_data: total_activity,
                activity: modifiedActivities
            }
        })

    } catch(e) {
        if(!e.statusCode){
            e.statusCode = statusCode['500_internal_server_error']
        }
        next(e)
    }
}



exports.get_one_activity = async (req, res, next) => {
    try{
        const id_activity = req.params.id
        const activity = await Activity.findById(id_activity)
        .select('id_tambang layer is_active waktu_mulai waktu_selesai created_by is_deleted')
        .populate('created_by', 'username name')
        .populate('id_tambang', '_id nama_tambang lokasi longitude latitude jumlah_layer is_active')

        if((!activity) && (req.role !== 'admin')) throw_err("Activity not found ", statusCode['404_not_found'])

        if((req.userId !== activity.created_by._id.toString()) && (req.role !== 'admin') ) throw_err("You are not authorized to see this activity", statusCode['401_unauthorized'])

        const coal = await Coal.find({
            activity_id: id_activity.toString(),
            is_deleted: false
        })
        .select('activity_id cal_value ash_cont moist_cont sulph_cont fc_vm is_deleted')

        const responseActivity = {
            ...activity._doc,
            tambang: activity.id_tambang,
            coal_data: coal
        };
        delete responseActivity.id_tambang

        res.status(statusCode['200_ok']).json({
            errors: false,
            message: "Data activity detail",
            data: responseActivity,
        });


    } catch(e) {
        if(!e.statusCode){
            e.statusCode = statusCode['500_internal_server_error']
        }
        next(e)
    }
}



exports.create_activity = async (req, res, next) => {
    try{
        const id_tambang = req.body.id_tambang
        const layer = req.body.layer

        const tambang_check = await Tambang.findById(id_tambang)
        if(!tambang_check) throw_err("Tambang not found", statusCode['404_not_found'])

        if(!tambang_check.is_active) throw_err("Tambang is not active", statusCode['400_bad_request'])

        const new_activity = new Activity({
            id_tambang: id_tambang,
            layer: layer,
            created_by: req.userId,
            waktu_mulai: new Date()
        })

        await new_activity.save()

        res.status(statusCode['200_ok']).json({
            errors: false,
            message: "Success create new data activity"
        })

    } catch(e) {
        if(!e.statusCode){
            e.statusCode = statusCode['500_internal_server_error']
        }
        next(e)
    }
}



exports.edit_activity = async (req, res, next) => {
    try{
        const id_activity = req.body.id_activity
        const layer = req.body.layer
        const id_tambang = req.body.id_tambang

        const activity = await Activity.findById(id_activity)
        if(!activity) throw_err("Activity not found", statusCode['404_not_found'])

        if(activity.created_by.toString() !== req.userId) throw_err("You are not authorized to edit this activity", statusCode['401_unauthorized'])

        const tambang_check = await Tambang.findById(id_tambang)
        if(!tambang_check) throw_err("Tambang not found", statusCode['404_not_found'])

        if(!tambang_check.is_active) throw_err("Tambang is not active", statusCode['400_bad_request'])

        activity.layer = layer
        activity.id_tambang = id_tambang

        await activity.save()

        res.status(statusCode['200_ok']).json({
            errors: false,
            message: "Success edit activity data"
        })

    } catch(e) {
        if(!e.statusCode){
            e.statusCode = statusCode['500_internal_server_error']
        }
        next(e)
    }
}



exports.change_status_activity = async (req, res, next) => {
    // TODO mungkin nanti bakal di tambah terkait misal ubah ini juga akan isi dari properti waktu selesai (belum tau akan gabung satu endpoint atau dipisah (activity done di bawah belum implementasi))
    try{
        const id_activity = req.body.id_activity

        const activity = await Activity.findById(id_activity)
        if(!activity) throw_err("Activity not found", statusCode['404_not_found'])

        if(activity.is_active) activity.is_active = false
        else activity.is_active = true

        await activity.save()

        res.status(statusCode['200_ok']).json({
            errors: false,
            message: "Success change active status activity"
        })

    } catch(e) {
        if(!e.statusCode){
            e.statusCode = statusCode['500_internal_server_error']
        }
        next(e)
    }
}



exports.activity_done = async (req, res, next) => {
    try {
        const id_activity = req.body.id_activity

        const activity = await Activity.findById(id_activity)
        if(!activity) throw_err("Activity not found", statusCode['404_not_found'])

        if(!activity.waktu_selesai) activity.waktu_selesai = new Date()
        else activity.waktu_selesai = null

        await activity.save()

        res.status(statusCode['200_ok']).json({
            errors: false,
            message: "Success change active status activity"
        })

    } catch (e) {
        if (!e.statusCode) {
            e.statusCode = statusCode['500_internal_server_error']
        }
        next(e)
    }
}



exports.delete_activity = async (req, res, next) => {
    try{
        const id_activity = req.body.id_activity

        const activity = await Activity.findById(id_activity)
        if(!activity) throw_err("Activity not found", statusCode['404_not_found'])

        if(activity.is_deleted) activity.is_deleted = false
        else activity.is_deleted = true

        await activity.save()

        res.status(statusCode['200_ok']).json({
            errors: false,
            message: "Success change deleted status on activity data"
        })

    } catch(e) {
        if(!e.statusCode){
            e.statusCode = statusCode['500_internal_server_error']
        }
        next(e)
    }
}