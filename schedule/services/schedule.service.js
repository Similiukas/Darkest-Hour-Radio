import Cache from "../../common/services/cache.service.js";

const CacheMemory = new Cache();

const SCHEDULE_TTL = 24 * 60 * 60 * 1000;

/**
 * Gets schedule from the cache if it exists and not expired. Otherwise returns null.
 * @returns cached schedule or null.
 */
export function getCachedSchedule() {
    if (CacheMemory.check('schedule')) {
        const schedule = CacheMemory.get('schedule');
        if (schedule.expiresIn < Date.now()) {
            return null;
        }
        return schedule.data;
    }
    return null;
}

/**
 * Saves the schedule to the cache.
 * @param {schedule} data schedule to save to cache.
 */
export function storeScheduleToCache(data) {
    CacheMemory.set("schedule", {
        data,
        expiresIn: new Date(new Date().getTime() + SCHEDULE_TTL)
    });
}
