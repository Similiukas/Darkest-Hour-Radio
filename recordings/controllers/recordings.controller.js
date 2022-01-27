const got = require("got");
const RecordsService = require("../services/record.service");
const RecordsModel = require("../models/record.model");

// const accepts = require("accepts");
// const brotli = require("zlib").createBrotliCompress;

async function pipeAudio(res, url) {
    try {
        //     /* Brotli compression doesn't really work? First, Firefox doesn't have accept br, and then Chrome kinda sus
        //        It works but kinda slow and over two requests. Insomnia also the same as chrome
        //     var encodings = new Set(accepts(req).encodings());
        //     console.log("Available encodings", encodings);
        //     if(encodings.has("br")){
        //         console.log("Request has brotli");
        //         // const compress = brotli.createBrotliCompress();
        //         res.header("Content-Encoding", "br");
        //         res.header('content-type', 'audio/mpeg');
        //         await got.stream(result).pipe(brotli()).pipe(res);
        //     }
        //     else{
        //         console.log("No brotli I guess");
        //         await got.stream(result).pipe(res);
        //     } */
        await got.stream(url).pipe(res);
    } catch (error) {
        throw new Error("Server experienced an error piping the audio file");
    }
}

function recordUrl(req, res, shortUrl) {
    const showName = req.params.showName;
    const record = req.params.recordId;
    const recordUrl = RecordsService.getCachedRecordUrl(showName, record, shortUrl);
    // Cache hit
    if (recordUrl) {
        if (shortUrl) {
            pipeAudio(res, recordUrl).then(() => res.status(200)).catch(err => res.status(500).send({ "Error": err.message }));
        } else {
            RecordsModel.updateRecordViews(showName, record)
            .then(() => {
                pipeAudio(res, recordUrl).then(() => res.status(200)).catch(err => res.status(500).send({ "Error": err.message }));
            })
        }
        return;
    }

    // Cache miss
    RecordsModel.getRecordURL(showName, record, shortUrl)
    .then(async (result) => {
        if (shortUrl) {
            RecordsService.storeRecordURLToCache(showName, record, result, null);
        } else {
            RecordsService.storeRecordURLToCache(showName, record, null, result);
            await RecordsModel.updateRecordViews(showName, record);
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
 * Test test test
 */
exports.something = (req, res) => {
    RecordsModel.test();
    res.status(200).send({message: "hello"}).end();
}

/**
 * Getting the list of all records
 */
exports.recordsList = (req, res) => {
    const records = RecordsService.getCachedRecords();
    // Cache hit
    if (records) {
        res.status(200).send(records);
        return;
    }

    // Cache miss
    RecordsModel.getRecordsList()
    .then(result =>{
        RecordsService.storeRecordsToCache(result);
        res.status(200).send(result);
    })
    .catch(err => {
        console.error("buvo error", err);
        res.status(500).send({ "Error": err.message });
    });
}

/**
 * Getting shorter clip audio file 
 */
exports.recordShortURL = (req, res) => {
    recordUrl(req, res, true);
}

/**
 * Getting the full record audio and adding a listener to database
 */
exports.recordFullURL = (req, res) => {
    recordUrl(req, res, false);
}