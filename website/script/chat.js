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

// Returns the signed-in user's display name.
function getUserName() {
  return `Random user + ${Math.random() * 10}`;
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
              console.log("Message data:", message, change);
              displayMessage(change.doc.id, message.timestamp, message.name, message.text);
          }
      });
  });
}

// Triggered when the send new message form is submitted.
function onMessageFormSubmit(e) {
  console.log("Event on submit", e);
  // Pressing enter on textarea submits the form
  // https://stackoverflow.com/a/49389811/9819103
  if (e.type === "submit" || (e.which === 13 && !e.shiftKey)){
    e.preventDefault();
    // Check that the user entered a message and is signed in.
    if (messageInputElement.value) {
      console.log("Submitting", messageInputElement.value);
      saveMessage(messageInputElement.value).then(function() {
          // Clear message text field and re-enable the SEND button.
          messageInputElement.value = '';
          toggleButton();
      });
    }
  }
}


// Template for messages.
var MESSAGE_TEMPLATE =
    '<div class="message-container">' +
        '<div class="name"></div>' +
        '<div class="message"></div>' +
    '</div>';

// A loading image URL.
var LOADING_IMAGE_URL = 'https://www.google.com/images/spin-32.gif?a';

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
  console.log("toggle button");
  if (messageInputElement.value) {
    console.log("NOT disabled");
    submitButtonElement.removeAttribute('disabled');
  } else {
    console.log("disabled");
    submitButtonElement.setAttribute('disabled', 'true');
  }
}

// Checks that the Firebase SDK has been correctly setup and configured.
function checkSetup() {
    if (!window.firebase || !(firebase.app instanceof Function) || !firebase.app().options) {
        window.alert('You have not configured and imported the Firebase SDK. ' +
            'Make sure you go through the codelab setup instructions and make ' +
            'sure you are running the codelab using `firebase serve`');
        return false;
    }
    return true;
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


function openChat(e) {
    // Essentially gonna have this function in another file maybe and all chat things gonna be there
    // So when you press on collapse to open chat, only then loaded() runs and all chat stuff

    // Opens the chat UI
    console.log(e.nextElementSibling);
    var chat = e.nextElementSibling;
    chat.style.maxHeight = chat.style.maxHeight ?  null : chat.scrollHeight + "px";
    e.textContent = e.textContent === "Open chat" ? "Close chat" : "Open chat";
    e.classList.toggle("active");

    // All back-end-ish stuff
    // Checks that Firebase has been imported.
    if (checkSetup()){
        // TODO: Enable Firebase Performance Monitoring.
        // firebase.performance();
    
        // We load currently existing chat messages and listen to new ones.
        loadMessages();
    }


}