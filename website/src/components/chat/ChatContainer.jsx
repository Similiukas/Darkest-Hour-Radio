import { useState } from 'react';
import { auth, signInAnonymously } from "../../firebaseConfig";
import ChatRoom from "./ChatRoom";
// If opened the chat the first time
let initialized = false;

const ChatContainer = () => {
    const [chatHeight, setChatHeight] = useState(null);
    const [buttonText, setButtonText] = useState("Open chat");

    function openChat(){
        setChatHeight(chatHeight ? null : "650px");   // I guess the actual height doesn't matter? As long as it's not null
        setButtonText(buttonText === "Open chat" ? "Close chat" : "Open chat");
        
        if (!initialized){
            signInAnonymously(auth)
            .then((userr) => {
                console.log("User", userr);
            })
            .catch((err) => {
                console.error("woops", err);
            })
            initialized = true;
        }
    }

    return (
        <div id="chat-container">
            <button className={`collapse-btn  ${chatHeight ? "active" : ""}`} type="button" onClick={openChat}>{buttonText}</button>

            { initialized && <ChatRoom chatHeight={chatHeight} /> }

        </div>
    )
}

export default ChatContainer
