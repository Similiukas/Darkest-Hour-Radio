const SongsController = require("./controllers/songs.controller");

exports.routesConfig = (app) => {
    app.get("/song/:name", [
        SongsController.getSong
    ]);
    app.post("/song/:name", [
        SongsController.heartSong
    ]);
    app.post("/unsong/:name", [
        SongsController.unheartSong
    ])
    app.get("/cache", [
        SongsController.getCache
    ]);
    app.delete("/cache", [
        SongsController.deleteCache
    ])
};