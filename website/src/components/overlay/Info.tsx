import { useContext } from 'react';

import { SettingsContext } from 'context';
import { convertDate } from 'utils';

type Props = {
    mounting: boolean,
    onClick: () => void,
}
// TODO: perziet ar tabindex ka daro
const Info = ({ mounting, onClick }: Props) => {
    const { scheduleInfo } = useContext(SettingsContext);

    return (
        <div className={`overlay ${mounting ? '' : 'fade-out'}`} role="button" tabIndex={-1} onClick={onClick}>
            <h3 style={{ paddingTop: 20 }}>Welcome to the <i><strong>Darkest Hour Radio</strong></i></h3>
            <h5>We pirate for your entertainment.</h5>
            <div id="overlay-text">
                { scheduleInfo && (
                    <>
                        <h5 id="schedule-header">Live radio show schedule:</h5><hr /><br />
                        <p id="schedule-main">{scheduleInfo[0].name}<time>{convertDate(scheduleInfo)}</time><br /></p><br /><br />
                    </>
                )}
                <h6 style={{ fontSize: '1.5vmax' }}>Contacts</h6><hr />
                <p id="overlay-description">
                    <br />If you love a song, then press on the <b style={{ color: 'pink' }}>&hearts;</b> to show the love!
                    <br />Darkest Hour Radio is an open source project and the whole code is at github:
                    <a href="https://github.com/Similiukas/Darkest-Hour-Radio" target="_blank" rel="noopener noreferrer" style={{ fontSize: '.8vmax' }}>Similiukas</a>
                    <br />Chat is completely anonymous and unmoderated. It&apos;s a wild west internet like it used to be before.
                    So feel free to express your opinion and talk with other listeners.
                    <br />If you want to contact the developer team (for song suggestions or if <strong>YOU</strong> want to host a live show on the radio) contact via
                    eMail: lesiimass0@gmail.com
                </p>
            </div>
        </div>
    );
};

export default Info;
