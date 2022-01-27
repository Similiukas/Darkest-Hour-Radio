const SongModel = require("../models/song.model");

const Cache = require("../../common/services/cache.service");

const CacheMemory = new Cache({ cachedSongs: [] });


/**
 * If the song exists in the cache, then it returns its' hearts. Else, ir returns null.
 * @param {string} songName name of the song
 * @returns hearts of the song from the cache
 */
exports.getCachedHearts = (songName) => {
    // If the song exists in cache, then we return it
    if (CacheMemory.check(`song: ${songName}`)) {
        return CacheMemory.get(`song: ${songName}`).new;
    }
    return null;
};

/**
 * Stores the new song to cache and updates the db if the cache already has 3 songs in it.
 * If the song already exists in cache, nothing is done.
 * @param {string} songName name of the song
 * @param {int} value hearts of the song
 */
exports.storeNewSongToCache = (songName, value) => {
    if (CacheMemory.check(`song: ${songName}`)) return;

    CacheMemory.set(`song: ${songName}`, { original: value, new: value });
    const cachedSongs = CacheMemory.get("cachedSongs");

    // If we already have 3 songs cached, then we save the oldest one's value
    if (cachedSongs.length === 3) {
        const oldestSong = cachedSongs.shift();
        const oldestSongHearts = CacheMemory.get(`song: ${oldestSong}`);
        CacheMemory.del(`song: ${oldestSong}`);
        if (oldestSongHearts.original !== oldestSongHearts.new) {
            // Then we write the new value to the DB. This might need to have await, just in case
            SongModel.writeSongHearts(oldestSong, oldestSongHearts.new);
        }
    }

    // We add the newest song to the song cache array end
    cachedSongs.push(songName);
}

/**
 * Updates `songName` hearts.
 * @param {string} songName name of the song
 * @param {boolean} increase heart song or unheart
 */
exports.updateSongHearts = (songName, increase) => {
    // In theory, update only happens after get, which means song is already in cache
    // If it's not in cache, then it's either a bug with previous and currentSong
    // Or just using curl hence ignoring the call
    if (CacheMemory.check(`song: ${songName}`)) {
        const hearts = CacheMemory.get(`song: ${songName}`);
        CacheMemory.set(`song: ${songName}`, { original: hearts.original, new: increase ? hearts.new + 1 : hearts.new - 1 });
    } else {
        throw new ReferenceError("Song does not exist in cache");
    }
}

exports.getCache = () => {
    return Cache.data;
}

exports.deleteCache = () => {
    CacheMemory.flush();
}
