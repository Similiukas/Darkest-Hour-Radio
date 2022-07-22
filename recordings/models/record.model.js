import got from "got";
import { db, FieldValue } from "../../common/services/firebase.service.js";

const recordsRef = db.collection("recordings");

/**
 * Gets the audio link from pcloud sharing file html
 * @param {string} url
 * @returns scraped url from pcloud
 */
async function getAudioURL(url){
    try {
        const response = await got(url);
        var s = response.body.indexOf("audiolink");
        var e = response.body.indexOf("downloadlink");
        return response.body.substring((s + 13), (e - 5)).replace(/\\/g, "");
    } catch (error) {
        return null;
    }
}

/**
 * Gets all the records from the database
 * @returns record list
 */
export async function getRecordsList() {
    try {
        let result = [];
        const snapshot = await recordsRef.get();
        for (let i = 0; i < snapshot.docs.length; ++i ) {
            const doc = snapshot.docs[i];
            result.push({ name: doc.id, recordings: [] });
            const recordMainDataSnapshot = await recordsRef.doc(doc.id).collection("recording-main-info").get();
            for (let j = 0; j < recordMainDataSnapshot.docs.length; j++) {
                const record = recordMainDataSnapshot.docs[j];
                const recordData = record.data();
                result[i].recordings.push({
                    name: record.id,
                    length: recordData.length,
                    listeners: recordData.listeners,
                    'creation-date': recordData["creation-date"],
                });
            }
        }
        return result;
    } catch (error) {
        return error;
    }
}

/**
 * Gets the url of the given record file from pcloud
 * @param {string} showName name of the record show
 * @param {string} id ID of the record
 * @param {boolean} shortURL trying to get the short clip url or the full record
 * @returns returns the url of the given record file from pcloud
 */
export async function getRecordURL(showName, id, shortURL=true) {
    const document = await recordsRef.doc(showName).collection("recording-main-info").doc(id).get();
    if(!document.exists){
        throw new ReferenceError("Document does not exit");
    }
    else{
        const data = document.data();
        const storageURL = await getAudioURL(data[shortURL ? "short-url" : "full-url"]);
        if(!storageURL){
            throw new Error("Error trying to get the storage url");
        }
        else{
            return storageURL;
        }
    }
}

/**
 * Updates the listener count and read time in the database
 * @param {string} showName name of the show
 * @param {string} id ID of the show
 */
 export async function  updateRecordViews(showName, id) {
    const mainDocumentRef = recordsRef.doc(showName).collection("recording-main-info").doc(id);
    await mainDocumentRef.update({
        listeners: FieldValue.increment(1),
        "read-time": FieldValue.serverTimestamp()
    });
}