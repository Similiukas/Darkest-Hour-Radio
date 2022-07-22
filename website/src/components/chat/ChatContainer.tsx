import { useState } from 'react';

import { auth, signInAnonymously } from 'firebaseConfig';

import ChatRoom from './ChatRoom';

// If opened the chat the first time
let initialized = false;

const ChatContainer = () => {
    const [chatHeight, setChatHeight] = useState<string|undefined>(undefined);
    const [buttonText, setButtonText] = useState('Open chat');

    async function openChat() {
        if (!initialized) {
            await signInAnonymously(auth);
            initialized = true;
        }
        setChatHeight(chatHeight ? undefined : '650px'); // I guess the actual height doesn't matter? As long as it's not null
        setButtonText(buttonText === 'Open chat' ? 'Close chat' : 'Open chat');
    }

    return (
        <div id="chat-container">
            <button className={`collapse-btn  ${chatHeight ? 'active' : ''}`} type="button" onClick={openChat}>{buttonText}</button>

            { (initialized || chatHeight) && <ChatRoom chatHeight={chatHeight} /> }

        </div>
    );
};

export default ChatContainer;
