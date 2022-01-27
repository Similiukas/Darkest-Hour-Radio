const ScheduleService = require('../services/schedule.service');
const ScheduleModel = require('../models/schedule.model');

exports.getSchedule = (req, res) => {
    const schedule = ScheduleService.getCachedSchedule();
    // Cache hit
    if (schedule) {
        res.status(200).send(schedule);
        return;
    }

    // Cache miss
    ScheduleModel.getSchedule()
    .then(result =>{
        ScheduleService.storeScheduleToCache(result);
        res.status(200).send(result);
    })
    .catch(err => {
        res.status(500).send({ "Error": err.message });
    });
};
