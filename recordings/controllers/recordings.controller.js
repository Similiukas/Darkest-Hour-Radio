const got = require("got");
const RecordsModel = require("../models/record.model");

// const accepts = require("accepts");
// const brotli = require("zlib").createBrotliCompress;

exports.something = (req, res) => {
    RecordsModel.test();
    res.status(200).send({message: "hello"}).end();
}

exports.recordsList = (req, res) => {
    RecordsModel.getRecordsList()
    .then((result) =>{
        res.status(200).send(result);
    })
    .catch(err => {
        res.status(500).send({ "Error": err.message });
    });
}

exports.recordShortURL = (req, res) => {
    RecordsModel.getRecordURL(req.params.showName, req.params.recordId)
    .then(async (result) => {
        try {


            /* Brotli compression doesn't really work? First, Firefox doesn't have accept br, and then Chrome kinda sus
               It works but kinda slow and over two requests. Insomnia also the same as chrome
            var encodings = new Set(accepts(req).encodings());
            console.log("Available encodings", encodings);
            if(encodings.has("br")){
                console.log("Request has brotli");
                // const compress = brotli.createBrotliCompress();
                res.header("Content-Encoding", "br");
                res.header('content-type', 'audio/mpeg');
                await got.stream(result).pipe(brotli()).pipe(res);
            }
            else{
                console.log("No brotli I guess");
                await got.stream(result).pipe(res);
            } */
            await got.stream(result).pipe(res);
            res.status(200);
        } catch (error) {
            res.status(500).send({ "Error": "Server experienced an error piping the audio file" });
        }
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

exports.recordFullURL = (req, res) => {
    RecordsModel.getRecordURL(req.params.showName, req.params.recordId, false)
    .then(async (result) => {
        try {
            await RecordsModel.updateRecordViews(req.params.showName, req.params.recordId);
            await got.stream(result).pipe(res);
            res.status(200);
        } catch (error) {
            res.status(500).send({ "Error": "Server experienced an error piping the audio file" });
        }
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