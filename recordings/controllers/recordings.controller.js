import got from 'got';
import { getCachedRecordUrl, storeRecordURLToCache, getCachedRecords, storeRecordsToCache } from "../services/record.service.js";
import { getRecordURL, getRecordsList } from "../models/record.model.js";

async function pipeAudio(res, url) {
    try {
        await got.stream(url).pipe(res);
    } catch (error) {
        throw new Error("Server experienced an error piping the audio file");
    }
}

/**
 * Getting the full record audio in chunks and adding a listener to database
 */
export function recordUrl(req, res) {
    const showName = req.params.showName;
    const record = req.params.recordId;
    const recordUrl = getCachedRecordUrl(showName, record, shortUrl);
    // Cache hit
    if (recordUrl) {
        if (shortUrl) {
            pipeAudio(res, recordUrl).then(() => res.status(200)).catch(err => res.status(500).send({ "Error": err.message }));
        } else {
            updateRecordViews(showName, record)
            .then(() => {
                pipeAudio(res, recordUrl).then(() => res.status(200)).catch(err => res.status(500).send({ "Error": err.message }));
            })
        }
        return;
    }

    // Cache miss
    getRecordURL(showName, record, shortUrl)
    .then(async (result) => {
        if (shortUrl) {
            storeRecordURLToCache(showName, record, result, null);
        } else {
            storeRecordURLToCache(showName, record, null, result);
            await updateRecordViews(showName, record);
        }
        pipeAudio(res, result).then(() => res.status(200)).catch(err => res.status(500).send({ "Error": err.message }));
    })
    .catch(err => {
        if (err instanceof ReferenceError){
            res.status(400).send({ "Error": "Invalid arguments" });
        }
        else{
            res.status(500).send({ "Error": err.message });
        }
    });
}

/**
 * Getting the list of all records
 */
export function recordsList(req, res) {
    const records = getCachedRecords();
    // Cache hit
    if (records) {
        res.status(200).send(records);
        return;
    }

    // Cache miss
    getRecordsList()
    .then(result =>{
        storeRecordsToCache(result);
        res.status(200).send(result);
    })
    .catch(err => {
        console.error("buvo error", err);
        res.status(500).send({ "Error": err.message });
    });
}
