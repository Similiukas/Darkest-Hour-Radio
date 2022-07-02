import React, { useRef, useEffect } from 'react';
import { useCollectionData } from 'react-firebase-hooks/firestore';

import { auth, onAuthStateChanged, updateProfile, firestore, query, collection, orderBy, limit } from 'firebaseConfig';

import ChatMessage from './ChatMessage';
import MessageSubmit from './MessageSubmit';

type Props = {
    chatHeight?: string
};

// eslint-disable-next-line max-len
const WORD_1 = ['khaki', 'orchid', 'light blue', 'dark salmon', 'cyan', 'pink', 'chartreuse', 'plum', 'gold', 'magenta', 'lime', 'green yellow', 'hot pink', 'violet', 'purple', 'rebecca purple'];
const WORD_2 = ['angry', 'sad', 'happy', 'hungry', 'surprised', 'confused', 'disappointed'];
const WORD_3 = ['woodchuck', 'elephant', 'monkey', 'porpoise', 'panda', 'fox', 'owl', 'starfish', 'cow', 'octopus', 'cat', 'doggo', 'hippopotamus', 'potato'];
// Generating random user name
function generateName() {
    const colour = WORD_1[Math.floor(Math.random() * WORD_1.length)];
    return `${colour} ${WORD_2[Math.floor(Math.random() * WORD_2.length)]} ${WORD_3[Math.floor(Math.random() * WORD_3.length)]}`;
}
// Returns name of user from browser storage or gets a new one.
function getUserName() {
    if (!localStorage.getItem('name')) {
        localStorage.setItem('name', generateName());
    }
    return localStorage.getItem('name');
}

onAuthStateChanged(auth, (user) => {
    // When user opens website and if previously has been logged in
    if (user) {
        console.log('Signed in then?', user);
        if (!user.displayName) {
            updateProfile(user, { displayName: getUserName() });
        }
    }
});

const ChatRoom: React.FC<Props> = ({ chatHeight }) => {
    const dummyRef = useRef<HTMLSpanElement>(null);
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
