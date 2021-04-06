const firebase = require("../../common/services/firebase.service");
const got = require("got");

const recordsRef = firebase.db.collection("recordings");
const FieldValue = firebase.FieldValue;

async function getAudioURL(url){
    try {
        // cover: https://e.pcloud.link/publink/show?code=XZ4Xx7ZCHcOynfUOyJado0U7RmQRY7yzoNk
        const response = await got("https://e.pcloud.link/publink/show?code=XZ4Xx7ZCHcOynfUOyJado0U7RmQRY7yzoNk"); //https://e.pcloud.link/publink/show?code=XZ7zx7ZaQk9FHN5dgBzSJ0lalH67kwWY0U7
        // console.log(response);
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

exports.updateRecordViews = async (showName, id) => {
    const storageDocumentRef = recordsRef.doc(showName).collection("recording-storage-data").doc(id);
    const mainDocumentRef = recordsRef.doc(showName).collection("recording-main-info").doc(id);
    await mainDocumentRef.update({ listeners: FieldValue.increment(1) });
    await storageDocumentRef.update({ "read-time": FieldValue.serverTimestamp() });
}