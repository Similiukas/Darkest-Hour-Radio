import { useState } from 'react';
import { firebase, firestore } from "../../firebaseConfig";

const MessageSubmit = ({ name }) => {
    const [formValue, setFormValue] = useState("");

    async function sendMessage(e){
        if ((/\S/).test(formValue)){
            e.preventDefault();
            await firestore.collection("messages").add({
                name: name(),
                text: /\n/.test(formValue[0]) ? formValue.slice(1) : formValue, // Prevents from first character as newline but the chat doesn't show any newlines either
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            })
            .catch((error) => {
                console.error("Error writing new message to Database", error);
            })
        }
        setFormValue("");
    }

    return (
        <form id="message-form" action="#" onSubmit={sendMessage}>
            <textarea
                id="message"
                value={formValue}
                onChange={(e) => setFormValue(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) sendMessage(e) }}
                type="text"
                name="message"
                placeholder="Message..."
                maxLength="200">
            </textarea>
            <button id="submit" type="submit" disabled={!formValue}>Chat</button>
        </form>
    )
}

export default MessageSubmit
