import { getCachedSchedule, storeScheduleToCache } from '../services/schedule.service.js';
import { getScheduleData } from '../models/schedule.model.js';

export function getSchedule(req, res) {
    const schedule = getCachedSchedule();
    // Cache hit
    if (schedule) {
        res.status(200).send(schedule);
        return;
    }

    // Cache miss
    getScheduleData()
    .then(result =>{
        storeScheduleToCache(result);
        res.status(200).send(result);
    })
    .catch(err => {
        res.status(500).send({ "Error": err.message });
    });
}
