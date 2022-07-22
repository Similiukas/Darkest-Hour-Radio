import React, { useRef, useEffect } from 'react';
import { useCollectionData } from 'react-firebase-hooks/firestore';

import { auth, onAuthStateChanged, updateProfile, firestore, query, collection, orderBy, limit } from 'firebaseConfig';
import { getUserName } from 'utils';

import ChatMessage from './ChatMessage';
import MessageSubmit from './MessageSubmit';

type Props = {
    chatHeight?: string
};

onAuthStateChanged(auth, (user) => {
    // When user opens website and if previously has been logged in
    getUserName();
    if (user) {
        console.log('Signed in then?', user);
        localStorage.setItem('uid', user.uid);
        if (!user.displayName) {
            updateProfile(user, { displayName: getUserName() });
        }
    }
});

const ChatRoom: React.FC<Props> = ({ chatHeight }) => {
    const dummyRef = useRef<HTMLSpanElement>(null);
    // TODO: this also returns if it's loading (2nd param), which could be used to show that messages are loading
    const [messages] = useCollectionData(query(collection(firestore, 'messages'), orderBy('timestamp', 'desc'), limit(12)));

    // Scrolling to the bottom
    useEffect(() => {
        if (dummyRef.current) {
            dummyRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    return (
        <div className="chat" style={{ maxHeight: chatHeight }}>
            <div id="all-messages">
                { messages &&
                  messages.slice(0).reverse().map((msg) => (
                      <ChatMessage
                          key={msg.timestamp?.seconds ?? Date.now()}
                          name={msg.name}
                          timestamp={msg.timestamp}
                          message={msg.text}
                      />
                  ))}
                {/* For scrolling to the bottom */}
                <span ref={dummyRef} />
            </div>

            <MessageSubmit name={getUserName} />
        </div>
    );
};

export default ChatRoom;
