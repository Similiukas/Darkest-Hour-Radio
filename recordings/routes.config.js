import { recordsList, recordUrl } from "./controllers/recordings.controller.js";

export default function routesConfig(app){
    app.get("/recordList", [
        recordsList
    ]);
    app.get("/record/:showName/:recordId/:uid", [
        // Can add validation middleware here
        recordUrl
    ]);
}