import { db, FieldValue } from "../../common/services/firebase.service.js";

const songsRef = db.collection("songs");

async function writeNewSong(songName) {
    const defaultData = {
        name: songName,
        "creation-date": FieldValue.serverTimestamp(),
        hearts: 0
    };
    await songsRef.doc(songName).set(defaultData);
}

export async function writeSongHearts(songName, value) {
    const songDocumentRef = songsRef.doc(songName);
    const songDocument = await songDocumentRef.get();
    if(songDocument.exists){
        await songDocumentRef.update({ hearts: value });
    }
    else{
        throw new ReferenceError("This song does not exist:", songName);
    }
}

export async function getSongHearts(songName) {
    const songDocument = await songsRef.doc(songName).get();
    if(songDocument.exists){
        const data = songDocument.data();
        const hearts = data["hearts"];
        return hearts;
    }
    else {
        await writeNewSong(songName);
        return 0;
    }
}
