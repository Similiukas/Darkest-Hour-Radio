import { getCachedHearts, storeNewSongToCache, updateSongHearts, getCacheData, deleteCacheData } from "../services/songs.service.js";
import { getSongHearts } from "../models/song.model.js";

export function getSong(req, res) {
    const songName = req.params.name;
    const cachedHearts = getCachedHearts(songName);
    if (cachedHearts) {
        res.status(200).send(cachedHearts.toString());
        return;
    }
    
    // If the song is not in cache, checking db
    getSongHearts(songName)
    .then(result => {
        storeNewSongToCache(songName, result);
        res.status(200).send(result.toString());
    })
    .catch(err => res.status(500).send({ Error: err.message }))
}

export function heartSong(req, res) {
    try {
        updateSongHearts(req.params.name, true);
        res.status(200).end();
    } catch (err) {
        res.status(400).send({ Error: err.message });
    }
}

export function unheartSong(req, res) {
    try {
        updateSongHearts(req.params.name, false);
        res.status(200).end();
    } catch (err) {
        res.status(400).send({ Error: err.message });
    }
}

export function getCache(req, res) {
    res.status(200).send(getCacheData());
}

export function deleteCache(req, res) {
    deleteCacheData();
    res.status(200).end();
}
