import { exit } from "process";
import { writeSongHearts } from "../../songs/models/song.model.js";

// Could use something like https://github.com/node-cache/node-cache as well but for simplicity this suffices
export default class Cache {

    // JavaScript is essentially prototype-based language rather than class-bases
    // Which mean that class with static methods should rather be objects
    // But it does work like this and I think it's more pretty.
    // https://stackoverflow.com/a/40987308/9819103
    static data = new Object();
    static STARTED_EXIT = false;

    constructor(initialValue) {
        if (initialValue) {
            Cache.data = { ...Cache.data, ...initialValue };
        }
        // sitas irgi gal but turi but static, kad butu pakviests tik karta
        process.on('SIGTERM', Cache.saveBeforeExit.bind(this));
    }

    /**
     * Saves key value pair to the cache. If key already existed, then the value is overwritten.
     * @param {string} key cache key.
     * @param {any} value value to.
     */
    set(key, value) {
        Cache.data[key] = value;
    }

    /**
     * Returns value of the key stored in cache. If key does not exist in the cache, ReferenceError will be thrown.
     * @param {string} key from cache whose value to return.
     * @returns value with the specified key.
     */
    get(key) {
        if (Cache.data.hasOwnProperty(key)) {
            return Cache.data[key];
        } else {
            throw new ReferenceError(`Cache with key ${key} does not exist`);
        }
    }

    /**
     * Deletes key value pair if it exists in the cache.
     * @param {string} key to delete value of.
     */
    del(key) {
        if (Cache.data.hasOwnProperty(key)) {
            delete Cache.data[key];
        }
    }

    /**
     * Check if key has a value in the cache.
     * @param {string} key to check.
     * @returns boolean.
     */
    check(key) {
        return Cache.data.hasOwnProperty(key);
    }

    /**
     * Saving cached songs to the database before exit.
     */
    static async saveBeforeExit() {
        // Making sure save is started only once
        if (Cache.STARTED_EXIT) return;
        Cache.STARTED_EXIT = true;
        console.log("[Cache service] Saving data to db before exiting", Cache.data);

        try {
            const cachedSongs = this.get("cachedSongs");
            for (const cachedSong of cachedSongs) {
                const cachedSongHearts = this.get(`song: ${cachedSong}`);
                if (cachedSongHearts.original !== cachedSongHearts.new) {
                    await writeSongHearts(cachedSong, cachedSongHearts.new);
                    console.log(`[Cache service] Saved ${cachedSong} to db`);
                }
            }
            console.log("[Cache service] Data saved to db successfully", Cache.data);
            exit();
        } catch (err) {
            console.error("[Cache service] Error saving cache to db:\n", err);
            exit(-1);
        }
    }

    /**
     * Deletes cache memory.
     */
    flush() {
        console.info("[Cache service] Deleting the whole cache");
        Cache.data = new Object();
    }
};
