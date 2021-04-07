const firebase = require("../../common/services/firebase.service");
const got = require("got");

const recordsRef = firebase.db.collection("recordings");
const FieldValue = firebase.FieldValue;

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

exports.test = () => {
    console.log("test goes grr");
}

/**
 * Gets all the records from the database
 * @returns record list
 */
exports.getRecordsList = async () => {
    try {
        let result = new Object();
        const snapshot = await recordsRef.get();
        for (const doc of snapshot.docs){
            let i = 0;
            result[doc.id] = [];
            const recordMainDataSnapshot = await recordsRef.doc(doc.id).collection("recording-main-info").get();
            for (const record of recordMainDataSnapshot.docs){
                result[doc.id][i] = record.data();
                result[doc.id][i]["id"] = record.id;
                ++i;
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
exports.getRecordURL = async (showName, id, shortURL=true) => {
    const documentRef = recordsRef.doc(showName).collection("recording-storage-data").doc(id);
    const document = await documentRef.get();
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
exports.updateRecordViews = async (showName, id) => {
    const storageDocumentRef = recordsRef.doc(showName).collection("recording-storage-data").doc(id);
    const mainDocumentRef = recordsRef.doc(showName).collection("recording-main-info").doc(id);
    await mainDocumentRef.update({ listeners: FieldValue.increment(1) });
    await storageDocumentRef.update({ "read-time": FieldValue.serverTimestamp() });
}