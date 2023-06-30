# How to add songs to the radio:

### **1. Download the songs**
 - Check every song if it has an empty starting or ending point. If it does, download it with a prefix **(START)**, **(END)** or **(BOTH)**.
 - Fix every file with a prefix. Delete the silence or any other unnecessary noise with *Audacity*.

### **2. Get their albums**
 - Create a playlist in Mixxx of all the newly adding songs.
 - Go to [musicbrainz](https://musicbrainz.org) and check every artist and then find the album.
 - If album is not found but the artist does exist on musicbrainz and using other album cover, mark it **yellow**.
 - If artist exists and album exists but no album cover, then mark it **orange** and add cover art to musicbrainz.
 - If artist exists but no album or no other album to get album cover, mark it **blue**.
 - If artist does not exist, mark it **red**.
 - If some other random cover art is fethced, mark it **pink**.
 - Export the songs' metadata to file metadata.

### **3. Test it**
 - Set every song as `TITLE - ARTIST #ALBUM`.
 - Play every song while connected to the testing radio: temp-static.web.app.
 - - *mount*: test-stream
 - - *port*: 8000
 - - *login*: source
 - If wrong album cover is displayed, mark it **COLOUR**.
 - Go through every **COLOUR** and assign album as the album MBID from musicbrainz (from url).
 - Fix the song title by deleting `#ALBUM`.

### **4. Assign their playlist**
 - Go through every song and try to assign its playlist accordingly.
 - Add every song to its appropriate crate by playlist.
 - Convert the songs to OPUS format (64kbps with variable bit rate). Need to do this only now because first need to set all the metadata correctly.

### **5. Upload to Firebase**
 - Upload every song to its playlist directory in Firebase.

### **6. Update the .pls files**
 - Go through every playlist and add the newly added songs to .pls. To simplify, in Mixxx filter the newly added playlist and sort by genre.

### **7. Upload .pls files to the radio**
 - Stop the radio.
 - Turn off the VM.
 - Turn it back on (just nice to regularly turn it off and on since RAM usually gets used more and more over time).
 - Stop the radio.
 - Delete the old .pls files.
 - Upload the new ones.
 - Start the radio.