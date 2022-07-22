import { recordsList, recordShortURL, recordFullURL } from "./controllers/recordings.controller.js";

export function routesConfig(app){
    app.get("/recordList", [
        recordsList
    ]);
    app.get("/recordShortURL/:showName/:recordId", [
        // Can add validation middleware here
        recordShortURL
    ]);
    app.get("/recordFullURL/:showName/:recordId", [
        recordFullURL
    ]);
}