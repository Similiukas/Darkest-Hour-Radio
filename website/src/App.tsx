import { useState } from 'react';

import AppStore from 'AppStore';
import ChatContainer from 'components/chat/ChatContainer';
import SecretCanvas from 'components/SecretCanvas';
import { SettingsProvider } from 'context';
import { useKonamiCode } from 'hooks';

import 'styles/style.scss';
// TODO: Minimize all the photos if not already wrote somewhere else. Also, look at other .todo
// TODO: Add liquidsoap backup playlist and see if that helps
// TODO: Dar ir pakeist background photo, gal ir gif (pirma img, poto kai uzloadin, tada gif or some. Galima ir canvas gif)

const App = () => {
    // TODO: If we start by playing the cloud record, how the timeout gonna be? I guess maybe then we don't need the timeout function? But still, when we press to go back to live, then we need to start timeout
    // TODO: Also, when the cloud record ends, what to do with UI?
    const [secret, setSecret] = useState(false);

    useKonamiCode(() => {
        console.log('Let the party begin');
        setSecret(true);
    });

    return (
        <>
            { secret && <SecretCanvas /> }

            { !secret && (
                <>
                    <SettingsProvider>
                        <AppStore setSecret={setSecret} />
                    </SettingsProvider>
                    <ChatContainer />
                </>
            )}
        </>
    );
};

export default App;
