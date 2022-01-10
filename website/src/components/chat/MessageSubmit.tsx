import { FormEvent, useState } from 'react';
import { firestore, collection, addDoc, serverTimestamp } from "firebaseConfig";

type Props = {
    name: () => string | null
}

const MessageSubmit = ({ name }: Props) => {
    const [formValue, setFormValue] = useState("");

    async function sendMessage(e: FormEvent){
        if ((/\S/).test(formValue)){
            e.preventDefault();
            await addDoc(collection(firestore, "messages"), {
                name: name(),
                text: /\n/.test(formValue[0]) ? formValue.slice(1) : formValue, // Prevents from first character as newline but the chat doesn't show any newlines either
                timestamp: serverTimestamp()
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
                // type="text"
                name="message"
                placeholder="Message..."
                maxLength={200}>
            </textarea>
            <button id="submit" type="submit" disabled={!formValue}>Chat</button>
        </form>
    )
}

export default MessageSubmit
