const RecordingsController = require("./controllers/recordings.controller");

exports.routesConfig = (app) =>{
    app.get("/test", [
        RecordingsController.something
    ]);
    app.get("/recordList", [
        RecordingsController.recordsList
    ]);
    app.get("/recordShortURL/:showName/:recordId", [
        // Can add validation middleware here
        RecordingsController.recordShortURL
    ]);
    app.get("/recordFullURL/:showName/:recordId", [
        RecordingsController.recordFullURL
    ]);
}