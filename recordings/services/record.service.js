import Cache from "../../common/services/cache.service.js";

const CacheMemory = new Cache();

const RECORD_LIST_TTL = 10*60*60*1000;  // 10 hours
const RECORD_URL_TTL  = 2*60*60*1000;   // 2 hours

/**
 * Gets record list from cache if it exists.
 * @returns cached record list
 */
export function getCachedRecords() {
    // If the song exists in cache, then we return it
    if (CacheMemory.check("recordList")) {
        const records = CacheMemory.get("recordList");
        if (records.expiresIn < Date.now()) {
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
        expiresIn: new Date(new Date().getTime() + RECORD_LIST_TTL)
    });
}

/**
 * Gets record url from cache if it exists.
 * @param {string} showName name of the show
 * @param {string} record name of the record
 * @param {boolean} shortUrl is it short url we need?
 * @returns record's url from cache
 */
export function getCachedRecordUrl(showName, record, shortUrl) {
    if (CacheMemory.check(`record: ${showName}-${record}`)) {
        const recordData = CacheMemory.get(`record: ${showName}-${record}`);
        if (recordData.expiresIn < Date.now()) {
            return null;
        }

        if (shortUrl) {
            return recordData.shortUrl;
        }
        return recordData.fullUrl;
    }
    return null;
};

/**
 * Stores record url data to cache.
 * @param {string} showName name of the show.
 * @param {string} record name of the record.
 * @param {string} shortUrl url of short record.
 * @param {string} fullUrl url of full record.
 */
export function storeRecordURLToCache(showName, record, shortUrl=null, fullUrl=null) {
    // If a record exists in cache (not expired), then we update the values if they are null
    if (CacheMemory.check(`record: ${showName}-${record}`)) {
        const recordData = CacheMemory.get(`record: ${showName}-${record}`);
        if (recordData.expiresIn > Date.now()) {
            CacheMemory.set(`record: ${showName}-${record}`, {
                shortUrl: recordData.shortUrl ?? shortUrl,    // If it was null, then we update it
                fullUrl: recordData.fullUrl ?? fullUrl,
                expiresIn: recordData.expiresIn
            });
            return;
        }
    }

    // If record data doesn't exist or expired
    CacheMemory.set(`record: ${showName}-${record}`, {
        shortUrl: shortUrl,
        fullUrl: fullUrl,
        expiresIn: new Date(new Date().getTime() + RECORD_URL_TTL)
    });
}
