import { getSchedule } from "./controllers/schedule.controller.js";

export default function routesConfig(app) {
    app.get("/schedule", [
        getSchedule
    ]);
}
