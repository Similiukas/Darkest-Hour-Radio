import { getSong, heartSong, unheartSong, getCache, deleteCache } from "./controllers/songs.controller.js";

export default function routesConfig(app) {
    app.get("/song/:name", [
        getSong
    ]);
    app.post("/song/:name", [
        heartSong
    ]);
    app.post("/unsong/:name", [
        unheartSong
    ])
    app.get("/cache", [
        getCache
    ]);
    app.delete("/cache", [
        deleteCache
    ])
}