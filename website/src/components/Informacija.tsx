import { useContext } from 'react';

import { SettingsContext } from 'context';
import logoImage from 'images/logo-min.png';
import { convertDate } from 'utils';
// import logoImage from '@images/logo-min.png';
// Aliases: https://dev.to/larswaechter/path-aliases-with-typescript-in-nodejs-4353

type Props = {
    secret: (enable: boolean) => void,
};

const Informacija = ({ secret }: Props) => {
    const { scheduleInfo } = useContext(SettingsContext);
    console.log('cia info', scheduleInfo);
    return (
        <div id="informacija">
            { scheduleInfo && (
                <div id="text">
                    Next live show schedule:
                    <strong style={{ paddingTop: 10 }}>{scheduleInfo[0].name}</strong>
                    <time style={{ fontSize: 'smaller', paddingTop: 2 }}>
                        {convertDate(scheduleInfo)}
                    </time>
                </div>
            )}
            <div id="logo-container">
                <img src={logoImage} alt="DHR logo" onClick={(e) => { if (e.detail === 3) secret(true); }} />
            </div>
        </div> /* <!-- Hide on desktop --> */
    );
};

export default Informacija;
