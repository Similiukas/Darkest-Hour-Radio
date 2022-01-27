const SongService = require("../services/songs.service");
const SongModel = require("../models/song.model");

exports.getSong = (req, res) => {
    const songName = req.params.name;
    const cachedHearts = SongService.getCachedHearts(songName);
    if (cachedHearts) {
        res.status(200).send(cachedHearts.toString());
        return;
    }
    
    // If the song is not in cache, checking db
    SongModel.getSongHearts(songName)
    .then(result => {
        SongService.storeNewSongToCache(songName, result);
        res.status(200).send(result.toString());
    })
    .catch(err => res.status(500).send({ Error: err.message }))
}

exports.heartSong = (req, res) => {
    try {
        SongService.updateSongHearts(req.params.name, true);
        res.status(200).end();
    } catch (err) {
        res.status(400).send({ Error: err.message });
    }
}

exports.unheartSong = (req, res) => {
    try {
        SongService.updateSongHearts(req.params.name, false);
        res.status(200).end();
    } catch (err) {
        res.status(400).send({ Error: err.message });
    }
}

exports.getCache = (req, res) => {
    res.status(200).send(SongService.getCache());
}

exports.deleteCache = (req, res) => {
    SongService.deleteCache();
    res.status(200).end();
}
