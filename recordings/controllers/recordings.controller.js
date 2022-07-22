import got from 'got';
import { getCachedRecordUrl, storeRecordURLToCache, getCachedRecords, storeRecordsToCache, checkRecordListener, storeRecordListenerToCache } from "../services/record.service.js";
import { getRecordURL, getRecordsList, updateRecordViews } from "../models/record.model.js";

/**
 * Gets the stream of the recording and increments views when a certain amount of recording has been pushed to the user's browser.
 * The return value is a stream which pushes data in chunks and only when requested, i.e. most browsers will not request the whole
 * amount of data, if it's too big. Only certain amount of data will be piped to the user.
 * @param {string} user firebase id.
 * @param {string} url of the recording file.
 * @param {number} size of the recording.
 * @param {string} showName name of the show.
 * @param {string} record name of the record.
 * @returns recording stream.
 */
async function pipeAudio(req, res, user, url, size, showName, record) {
    try {
        let range = (req.headers.range) ? req.headers.range.replace(/bytes=/, "").split("-") : [];
        
        range[0] = range[0] ? parseInt(range[0], 10) : 0;
        let chunkSize = range[0] === 0 ? 1024 * 1024 : 1024 * 1024 * 5;  // exactly 5MB
        range[1] = range[1] ? parseInt(range[1], 10) : range[0] + chunkSize;
        range[1] = Math.min(range[1], size - 1);
        range = {start: range[0], end: range[1]};
        const stream = got.stream(url, {
            headers: {
                // 'Cache-Control': 'no-cache',
                // 'Pragma': 'no-cache',
                'Connection': 'keep-alive',
                'Range': 'bytes=' + range.start + '-' + range.end
            }
        });
        stream.on('downloadProgress', () => {
            // For some browsers, if you have the link in the <audio> tag src, then the browsers (Chrome) will ask for the beginning and the end of the audio
            if (range.start / size > 0.15 && range.start / size < 0.9) {
                // Need to add a new listener here if not already added
                if (checkRecordListener(user, showName, record) === false) {
                    storeRecordListenerToCache(user, showName, record);
                    updateRecordViews(showName, record);
                }
            }
        });

        res.writeHead(206, {
            // 'Cache-Control': 'no-cache, no-store, must-revalidate',
            // 'Pragma': 'no-cache',
            // 'Expires': 0,
            'Content-Type': 'audio/ogg',
            'Accept-Ranges': 'bytes',
            'Content-Range': 'bytes ' + range.start + '-' + range.end + '/' + size,
            'Content-Length': range.end - range.start + 1,
        });
        return stream;
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
    const userID = req.params.uid;
    const [recordUrl, recordSize] = getCachedRecordUrl(showName, record);

    // Cache hit
    if (recordUrl) {
        pipeAudio(req, res, userID, recordUrl, recordSize, showName, record).then(stream => {
            stream.pipe(res);
        }).catch(err => res.status(500).send({ "Error": err.message }));
        return;
    }

    // Cache miss
    getRecordURL(showName, record).then(([recordUrl, recordSize]) => {
        storeRecordURLToCache(showName, record, recordUrl, recordSize);
        pipeAudio(req, res, userID, recordUrl, recordSize, showName, record).then(stream => {
            stream.pipe(res);
        }).catch(err => res.status(500).send({ "Error": err.message }));
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
