const ScheduleController = require("./controllers/schedule.controller");

exports.routesConfig = (app) => {
    app.get("/schedule", [
        ScheduleController.getSchedule
    ]);
};
