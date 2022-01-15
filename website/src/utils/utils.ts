/**
 * Parses data from Icecast source and splits into artist, title, mbid and checks if dj has connected
 * @param {String} data title of the Icecast source
 * @param {Function} setLive callback function which is called if detected that we are live
 * @returns Returns the parsed data as groups (artist, title, album)
 */
export function parseMetadata(data: string, setLive?: (areWeLive: boolean) => void) {
    if (data.slice(-6) === '$live$') {
        console.log('We are live');
        if (setLive) setLive(true);
        // eslint-disable-next-line no-param-reassign
        data = data.slice(0, -7);
    } else if (setLive) setLive(false);
    const parsedData = data.match('(.+) - (.+) #(.+)') ?? data.match('(.+) - (.+)'); // Group 3 is missing (no added album or MBID)
    if (!parsedData) return undefined;
    // Sometimes the server puts the album twice so if it does, then stripping it off
    if ((/(.+) #(.+)/g).test(parsedData[2])) parsedData[2] = parsedData[2].replace(/(.+) #(.+)/g, '$1');
    return parsedData;
}

/**
 * Searches songs (releases) and returns all matched songs JSON
 * @param {String} artist Artist name string
 * @param {String} song Song name string
 */
export async function searchRecordings(artist: string, song: string) {
    const recordings = await fetch(`https://musicbrainz.org/ws/2/recording/?query=artist:${artist} AND recording:${song}&fmt=json`);
    const recordingsJSON = await recordings.json();
    return recordingsJSON;
}

/**
 * Filters radios and playlist albums (releases) and returns best fit release group MBID
 * @param {String} artist Artist name string
 * @param {JSON} recordings Recordings JSON
 */
export function filterRadios(artist: string, recordings: any) {
    let backup;
    try {
        backup = recordings[0].releases[0]['release-group'].id;
    } catch (error) {
        console.error('Error in filtering radios (getting backup)', error);
        return 'NONE'; // Failed to find a backup
    }
    try {
        for (let recordingIndex = 0; recordingIndex < recordings.length; recordingIndex++) {
            const record = recordings[recordingIndex];
            for (let releaseIndex = 0; releaseIndex < record.releases.length; releaseIndex++) {
                const release = record.releases[releaseIndex];
                console.log(release);
                if (release['artist-credit']?.[0].name.toLowerCase() === 'various artists') {
                    console.log('Found radio');
                    // continue;
                } else if (release['artist-credit']?.[0].name.toLowerCase() === artist.toLowerCase()) {
                    console.log('Right artist');
                    return release['release-group'].id;
                }
            }
        }
        return backup;
    } catch (error) {
        console.error('Error in filtering radios (looking through recordings)', error);
        return backup;
    }
}

/**
 * Searches album groups (release-group) and returns the first one's ID
 * @param {String} artist Artist name string
 * @param {String} album Album name string
 */
export async function searchRelease(artist: string, album: string) {
    const release = await fetch(`https://musicbrainz.org/ws/2/release-group/?query=artist:${artist} AND release:${album}&fmt=json`);
    const releaseJSON = await release.json();
    return releaseJSON['release-groups'][0].id;
}
