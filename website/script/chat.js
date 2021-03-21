/**
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

const WORD_1 = ["khaki", "orchid", "light blue", "dark salmon", "medium spring green", "cyan", "pink", "chartreuse", "plum", "gold", "magenta", "lime", "green yellow", "hot pink", "violet"];
const WORD_2 = ["angry", "sad", "happy", "hungry", "surprised", "confused", "disappointed"]
const WORD_3 = ["woodchuck", "elephant", "monkey", "porpoise", "panda", "fox", "owl", "starfish", "cow", "octopus", "cat", "doggo", "hippopotamus"];

// Generating random user name
function generateName() {
    const colour = WORD_1[Math.floor(Math.random() * WORD_1.length)];
    localStorage.setItem("colour", colour.replace("/\s/g", ""));
    return colour + " " + WORD_2[Math.floor(Math.random() * WORD_2.length)] + " " + WORD_3[Math.floor(Math.random() * WORD_3.length)];
}

// Returns name of user from browser storage or gets a new one.
function getUserName() {
    if (localStorage.getItem("name") == null){
        localStorage.setItem("name", generateName());
    }
return localStorage.getItem("name");
}

// Saves a new message on the Cloud Firestore.
function saveMessage(messageText) {
    // Add a new message entry to the Firebase database.
    return firebase.firestore().collection('messages').add({
        name: getUserName(),
        text: messageText,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).catch(function(error) {
        console.error('Error writing new message to Firebase Database', error);
    });
}

// Loads chat messages history and listens for upcoming ones.
function loadMessages() {
    // Create the query to load the last 12 messages and listen for new ones.
    var query = firebase.firestore().collection('messages').orderBy('timestamp', 'desc').limit(12);

    // Start listening to the query.
    query.onSnapshot(function(snapshot) {
        snapshot.docChanges().forEach(function(change) {
            if (change.type === 'removed') {
                deleteMessage(change.doc.id);
            } else {
                var message = change.doc.data();
                console.log("Message data:", message, change, snapshot);
                displayMessage(change.doc.id, message.timestamp, message.name, message.text);
            }
        });
    });
}

// Triggered when the send new message form is submitted.
var timeout = false;
function onMessageFormSubmit(e) {
    // Pressing enter on textarea submits the form
    // https://stackoverflow.com/a/49389811/9819103
    if (e.type === "submit" || (e.which === 13 && !e.shiftKey)) {
        e.preventDefault();

        if (timeout){
            console.error("Slow down a bit here");
            return;
        }
        timeout = true;
        
        // Check that the user entered a message and is signed in.
        if (messageInputElement.value) {
            console.log("Submitting", messageInputElement.value);
            saveMessage(messageInputElement.value).then(function() {
                // Clear message text field and re-enable the SEND button.
                messageInputElement.value = '';
                toggleButton();
            });
            // A timeout for user to not spam to DataBase
            setTimeout(() => timeout = false, 3000);
        }
    }
}


// Template for messages.
var MESSAGE_TEMPLATE =
    '<div class="message-container">' +
        '<span class="name"></span>' +
        '<span class="timestamp"></span>' +
        '<span class="message"></span>' +
    '</div>';

// Delete a Message from the UI.
function deleteMessage(id) {
    var div = document.getElementById(id);
    // If an element for that message exists we delete it.
    if (div) {
        div.parentNode.removeChild(div);
    }
}

function createAndInsertMessage(id, timestamp) {
    const container = document.createElement('div');
    container.innerHTML = MESSAGE_TEMPLATE;
    const div = container.firstChild;
    div.setAttribute('id', id);

    // If timestamp is null, assume we've gotten a brand new message.
    // https://stackoverflow.com/a/47781432/4816918
    timestamp = timestamp ? timestamp.toMillis() : Date.now();
    div.setAttribute('timestamp', timestamp);

    // figure out where to insert new message
    const existingMessages = messageListElement.children;
    if (existingMessages.length === 0) {
        messageListElement.appendChild(div);
    } else {
        let messageListNode = existingMessages[0];

        while (messageListNode) {
            const messageListNodeTime = messageListNode.getAttribute('timestamp');

            if (!messageListNodeTime) {
                throw new Error(
                    `Child ${messageListNode.id} has no 'timestamp' attribute`
                );
            }

            if (messageListNodeTime > timestamp) {
                break;
            }

            messageListNode = messageListNode.nextSibling;
        }

        messageListElement.insertBefore(div, messageListNode);
    }

    return div;
}

// Displays a Message in the UI.
function displayMessage(id, timestamp, name, text) {
    var div = document.getElementById(id) || createAndInsertMessage(id, timestamp);

    div.querySelector('.name').textContent = name + ":";
    div.querySelector(".name").style.color = name.match("(.*) (\\w*) (\\w*)")[1].replace(/\s/g, "");    // Adding color to name
    if (localStorage.getItem("name") === name)  div.classList.add("myself");    // Styling if user sent the message (or another user with same name)
    if (timestamp) {
        var timestampElement = div.querySelector(".timestamp");
        // Same day
        if (timestamp.toDate().getDay() === new Date().getDay() && timestamp.toDate().getMonth() === new Date().getMonth()){
            timestampElement.textContent = ` [${timestamp.toDate().toLocaleTimeString()}] `;
            // Would be cool to know how long ago but timestamps wouldn't be updated
            // var diff = new Date - timestamp.toDate();
            // if (diff < 60 * 1000)   timestampElement.textContent = `[${Math.floor(diff / 1000)} seconds ago]`;
            // else if (diff < 60 * 60 * 1000) timestampElement.textContent = `[${Math.floor(diff / 60 / 1000)} minutes ago]`;
            // else    timestampElement.textContent = `[${Math.floor(diff / 60 / 60 / 1000)} hours ago]`;
        }
        else timestampElement.textContent = ` [${timestamp.toDate().toLocaleDateString()}] `;
    }
    var messageElement = div.querySelector('.message');

    messageElement.textContent = text;
    // Replace all line breaks by <br>.
    messageElement.innerHTML = messageElement.innerHTML.replace(/\n/g, '<br>');

    // Show the card fading-in and scroll to view the new message.
    setTimeout(function() {div.classList.add('visible')}, 1);
    messageListElement.scrollTop = messageListElement.scrollHeight;
    messageInputElement.focus();
}

// Enables or disables the submit button depending on the values of the input fields.
function toggleButton() {
    if (messageInputElement.value) {
        submitButtonElement.removeAttribute('disabled');
    } else {
        submitButtonElement.setAttribute('disabled', 'true');
    }
}

// Checks that the Firebase SDK has been correctly setup and configured.
function checkSetup() {
    if (!window.firebase || !(firebase.app instanceof Function) || !firebase.app().options) {
        window.alert('You have not configured and imported the Firebase SDK. ' +
            'Make sure you go through the codelab setup instructions and make ' +
            'sure you are running the codelab using `firebase serve`');
    }
}

// Shortcuts to DOM Elements.
var messageListElement = document.getElementById('all-messages');
var messageFormElement = document.getElementById('message-form');
var messageInputElement = document.getElementById('message');
var submitButtonElement = document.getElementById('submit');

// Saves message on form submit.
messageFormElement.addEventListener('submit', onMessageFormSubmit);
messageInputElement.addEventListener("keypress", onMessageFormSubmit);

// Toggle for the button.
messageInputElement.addEventListener('keyup', toggleButton);
messageInputElement.addEventListener('change', toggleButton);

// When user clicks Open chat
var initialized = false;
function openChat(e) {

    // Opens the chat UI
    var chat = e.nextElementSibling;
    chat.style.maxHeight = chat.style.maxHeight ?  null : chat.scrollHeight + "px";
    e.textContent = e.textContent === "Open chat" ? "Close chat" : "Open chat";
    e.classList.toggle("active");

    // All back-end-ish stuff
    if (!initialized){
        initialized = true;
        // Checks that Firebase has been imported.
        checkSetup();

        // Enabling Firebase Performance Monitoring.
        firebase.performance();
        // Can also add custom traces and metrics:
        // https://firebase.google.com/codelabs/firebase-perf-mon-web#5

        // We load currently existing chat messages and listen to new ones.
        loadMessages();
    }
}