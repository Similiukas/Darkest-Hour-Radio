import { useState, useEffect } from 'react';
import { Timestamp } from 'firebaseConfig';

type Props = {
    name: string,
    timestamp: Timestamp,
    message: string,
}

const ChatMessage = ({ name, timestamp, message }: Props) => {
    const [messageAge, setMessageAge] = useState<string|null>(null);
    const [isMessageVisible, setMessageVisible] = useState("");

    useEffect(() => {
        if(timestamp){
            // If the same day (difference is less than 24 * 60 * 60 * 1000)
            if (Date.now() - timestamp.seconds * 1000 < 86400000){
                setMessageAge(` [${timestamp.toDate().toLocaleTimeString()}] `);
                // Would be cool to know how long ago but timestamps wouldn't be updated
                // var diff = new Date - timestamp.toDate();
                // if (diff < 60 * 1000)   timestampElement.textContent = `[${Math.floor(diff / 1000)} seconds ago]`;
                // else if (diff < 60 * 60 * 1000) timestampElement.textContent = `[${Math.floor(diff / 60 / 1000)} minutes ago]`;
                // else    timestampElement.textContent = `[${Math.floor(diff / 60 / 60 / 1000)} hours ago]`;
            }
            else setMessageAge(` [${timestamp.toDate().toLocaleDateString()}] `);
        }
        // Adding class after it's rendered to fade-in
        const timer = setTimeout(() => setMessageVisible("visible"), 10);
        return () => clearTimeout(timer);
    }, [timestamp]);

    return (
        <div
            className={`message-container ${isMessageVisible} ${localStorage.getItem("name") === name ? "myself" : ""}`}
            // timestamp={timestamp ? timestamp.toMillis() : Date.now()}
        >
            <span
                className="name"
                //@ts-ignore
                style={{ color: name.match("(.*) (\\w*) (\\w*)")[1].replace(/\s/g, "") }}
            >
                {name}
            </span>
            <span className="timestamp">{messageAge}</span>
            <span className="message">{message}</span>
        </div>
    )
}

export default ChatMessage
