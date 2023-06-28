import { useState, useEffect, useContext, useCallback } from 'react';
import { Range, Direction, getTrackBackground } from 'react-range';

import { SettingsContext } from 'context';
import defaultPhoto from 'images/logo-min.webp';
import pixels from 'pixels.json';
import { OverlayType, PastRecordData } from 'types';
import { addCoverArt, filterRadios, parseHTMLEntities, parseMetadata, searchRecordings, searchRelease } from 'utils';

import PlayerHUD from './PlayerHUD';

type Props = {
    templateRatio: number,
    currentSong: string | null,
    listenerCount: string,
    setLive: (areWeLive: boolean) => void,
    togglePlay: (startPlaying: boolean) => void,
    volumeChange: (increase: boolean | number) => void,
    pastRecordData: PastRecordData | null,
    isAudioPlaying: boolean
}

type SongInfo = {
    title: string,
    artist: string,
    album: string,
}

const Player = ({ templateRatio, currentSong, listenerCount, setLive, togglePlay, volumeChange, pastRecordData, isAudioPlaying }: Props) => {
    const width = window.innerWidth > 1025 ? templateRatio * pixels.Player.width - 2 * templateRatio * pixels.Player.width * pixels.Player.MARGIN_X : undefined;
    const height = window.innerWidth > 1025 ? templateRatio * pixels.Player.height - 2 * templateRatio * pixels.Player.height * pixels.Player.MARGIN_Y : undefined;
    const marginLeft = window.innerWidth > 1025 ? templateRatio * pixels.Player.width * pixels.Player.MARGIN_X : undefined;
    const marginTop = window.innerWidth > 1025 ? templateRatio * (pixels.templateHeight - pixels.Player.height) + templateRatio * pixels.Player.height * pixels.Player.MARGIN_Y : undefined;

    const [songInfo, setSongInfo] = useState<SongInfo>({ title: 'Loading...', artist: 'UwU', album: '' });
    const [coverPhotoUrl, setCoverPhotoUrl] = useState(defaultPhoto);
    const [playButtonText, setPlayButtonText] = useState('play_circle');
    const [volume, setVolume] = useState([0.4]);

    const { overlayType } = useContext(SettingsContext);

    const updateCoverArt = useCallback(async (song: string | null) => {
        if (!song) return;
        const songInfo = parseMetadata(song, setLive);
        if (!songInfo) return;
        setSongInfo({
            title: songInfo[2],
            artist: `By ${songInfo[1]}`,
            album: `Album: ${songInfo[3]}`,
        });
        console.log('Song changed to:', songInfo);
        try {
            if (songInfo.length === 3) {
                // Search for recording by artist and recoding
                // Search for release from recording IDs (filtering radios)
                // Add cover art from filtered recording or switch to default
                const recordings = await searchRecordings(songInfo[1], songInfo[2]);
                const MBID = filterRadios(songInfo[1], recordings.recordings);
                if (MBID === 'NONE') {
                    setCoverPhotoUrl(defaultPhoto);
                } else {
                    addCoverArt(MBID, true, (imgUrl) => setCoverPhotoUrl(imgUrl ?? defaultPhoto));
                }
            } else if ((songInfo[3].match(/.-./g) || []).length >= 2) { // If album or MBID has more than 2 '-', then it's MBID
                addCoverArt(songInfo[3], false, (imgUrl) => setCoverPhotoUrl(imgUrl ?? defaultPhoto)); // Search for cover art by release MBID
            } else {
                // Search for release by artist and album name
                // Search for cover art by release
                const MBID = await searchRelease(songInfo[1], songInfo[3]);
                addCoverArt(MBID, true, (imgUrl) => setCoverPhotoUrl(imgUrl ?? defaultPhoto));
            }
        } catch (error) {
            console.error(`There was an error trying to get cover art for this [${songInfo}] audio.\nSwitching to default photo\nError:`, error);
            setCoverPhotoUrl(defaultPhoto);
        }
    }, [setLive]);

    useEffect(() => {
        if (pastRecordData) {
            setSongInfo({
                title: pastRecordData.name,
                artist: '',
                album: '',
            });
            setPlayButtonText('pause_circle');
            setCoverPhotoUrl(defaultPhoto);
        } else if (currentSong === 'ad') {
            setSongInfo({
                title: 'Darkest Hour Radio',
                artist: '',
                album: '',
            });
            setCoverPhotoUrl(defaultPhoto);
        } else if (currentSong !== null && currentSong !== '') {
            updateCoverArt(parseHTMLEntities(currentSong));
        } else if (currentSong === '') { // Initially it's null so not changing anything and default values are set
            setSongInfo({
                title: 'Temporarily offline',
                artist: '',
                album: '',
            });
            setCoverPhotoUrl(defaultPhoto);
        }
    }, [currentSong, pastRecordData, updateCoverArt]);

    useEffect(() => {
        if (isAudioPlaying && !!currentSong && currentSong !== 'ad') {
            const songInfo = parseMetadata(currentSong);
            if (!songInfo) return;
            document.title = `${songInfo[2]} - ${songInfo[1]}`;
        } else {
            document.title = 'DHRadio';
        }
    }, [isAudioPlaying, currentSong, pastRecordData]);

    return (
        <div
            id="player"
            style={{
                width,
                height,
                marginLeft,
                marginTop,
            }}
        >
            <div id="player-controls">
                <span
                    className="control play material-icons md-48"
                    role="button"
                    tabIndex={-1}
                    onClick={() => {
                        togglePlay(playButtonText === 'play_circle');
                        setPlayButtonText(playButtonText === 'play_circle' ? 'pause_circle' : 'play_circle');
                    }}
                >
                    {overlayType === OverlayType.TimeoutStart ? 'play_circle' : playButtonText}
                </span>   {/* <!-- Hide in desktop--> */}

                <div className="song info">
                    <span className={`name ${songInfo.title.length > 15 ? 'small' : ''}`}>{songInfo.title}</span>
                    <span className={`artist ${songInfo.artist.length > 15 ? 'small' : ''}`}>{songInfo.artist}</span>
                </div>

                { window.innerWidth < 1025 && (
                    <div className="control sound">
                        <Range
                            direction={Direction.Up}
                            min={0}
                            max={1}
                            step={0.1}
                            values={volume}
                            onChange={(e) => { setVolume(e); volumeChange(e[0]); }}
                            renderTrack={({ props, children }) => (
                                <div className="volume-slider-track">
                                    <div
                                        className="volume-slider-track-inner"
                                        ref={props.ref}
                                        style={{ background: getTrackBackground({
                                            values: volume,
                                            colors: ['#548BF4', '#ccc'],
                                            min: 0,
                                            max: 1,
                                            direction: Direction.Up,
                                            rtl: false,
                                        }) }}
                                    >
                                        {children}
                                    </div>
                                </div>
                            )}
                            renderThumb={({ props, isDragged }) => (
                                // eslint-disable-next-line react/jsx-props-no-spreading
                                <div className="volume-slider-thumb" {...props}>
                                    <div
                                        className="volume-slider-thumb-inner"
                                        style={{
                                            backgroundColor: isDragged ? '#548BF4' : '#CCC',
                                        }}
                                    />
                                </div>
                            )}
                        />
                    </div>
                )}
            </div>

            { window.innerWidth < 1025 && (
                <PlayerHUD
                    templateRatio={templateRatio}
                    listenerCount={listenerCount}
                    currentSong={currentSong}
                />
            )}

            {/* TODO: Above the photo there's a bar showing how much of a recording has passed and left */}
            <img id="cover-art" src={coverPhotoUrl} alt="Album cover" title={songInfo.album} />
        </div>
    );
};

export default Player;
