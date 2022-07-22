import Cache from "../../common/services/cache.service.js";

const CacheMemory = new Cache();

const RECORD_LIST_TTL = 10*60*60*1000;  // 10 hours
const RECORD_URL_TTL  = 2*60*60*1000;   // 2 hours

/**
 * Returns record data if it exists in cache and is not expired. Else returns `null`.
 * @param {string} showName name of the show
 * @param {string} record name of the record
 * @returns record data
 */
function getCachedRecordData(showName, record) {
    if (CacheMemory.check(`record-${showName}-${record}`)) {
        const recordData = CacheMemory.get(`record-${showName}-${record}`);
        if (recordData.expiresAt > Date.now()) {
            return recordData;
        }
    }
    return null;
}

/**
 * Gets record list from cache if it exists.
 * @returns cached record list
 */
export function getCachedRecords() {
    // If the song exists in cache, then we return it
    if (CacheMemory.check("recordList")) {
        const records = CacheMemory.get("recordList");
        if (records.expiresAt < Date.now()) {
            return null;
        }
        return records.records;
    }
    return null;
}

/**
 * Stores records to cache.
 * @param {any} records to store in cache
 */
export function storeRecordsToCache(records) {
    CacheMemory.set("recordList", {
        records,
        expiresAt: new Date(new Date().getTime() + RECORD_LIST_TTL)
    });
}

/**
 * Gets record url from cache if it exists.
 * @param {string} showName name of the show
 * @param {string} record name of the record
 * @param {boolean} shortUrl is it short url we need?
 * @returns record's url from cache
 */
export function getCachedRecordUrl(showName, record) {
    if (CacheMemory.check(`record-${showName}-${record}`)) {
        const recordData = CacheMemory.get(`record-${showName}-${record}`);
        if (recordData.expiresAt < Date.now()) {
            return [null, null];
        }
        return [recordData.url, recordData.size];
    }
    return [null, null];
}

/**
 * Stores record url data to cache.
 * @param {string} showName name of the show.
 * @param {string} record name of the record.
 * @param {string} url url of full record.
 */
export function storeRecordURLToCache(showName, record, url, size) {
    const recordData = getCachedRecordData(showName, record);
    // If a record exists in cache (not expired), then we update the values if they are null
    if (recordData) {
        CacheMemory.set(`record-${showName}-${record}`, {
            url: recordData.url ?? url,    // If it was null, then we update it
            size: recordData.size ?? size,
            listeners: [],
            expiresAt: recordData.expiresAt
        });
        return;
    }

    // If record data doesn't exist or expired
    CacheMemory.set(`record-${showName}-${record}`, {
        url,
        size,
        listeners: [],
        expiresAt: new Date(new Date().getTime() + RECORD_URL_TTL)
    });
}

/**
 * Checks if the user has listened to the record. If the record is not in cache, returns `null`.
 * @param {string} userID firebase user id
 * @param {string} showName name of the show
 * @param {string} record name of the record
 * @returns `boolean`
 */
export function checkRecordListener(userID, showName, record) {
    const recordData = getCachedRecordData(showName, record);
    console.log('record', recordData, recordData.listeners);
    if(!recordData) return null;

    // If a record exists in cache (not expired), then we check if this user has already been added to listeners
    return recordData.listeners && recordData.listeners.includes(userID);
}

/**
 * Stores new listener to the record.
 * @param {string} userID firebase user id
 * @param {string} showName name of the show
 * @param {string} record name of the record
 * @returns `null` if the record is not in cache
 */
export function storeRecordListenerToCache(userID, showName, record) {
    const recordData = getCachedRecordData(showName, record);
    if (!recordData) return null;

    // If a record exists in cache (not expired), then we add a new listener to the list
    CacheMemory.set(`record-${showName}-${record}`, {
        url: recordData.url,
        size: recordData.size,
        expiresAt: recordData.expiresAt,
        listeners: [
            ...recordData.listeners,
            userID
        ]
    });
}
