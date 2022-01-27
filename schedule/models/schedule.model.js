const firebase = require("../../common/services/firebase.service");

const scheduleRef = firebase.db.collection("schedule");

exports.getSchedule = async () => {
    try {
        let result = [];
        const scheduleSnapshot = await scheduleRef.get();
        for (const doc of scheduleSnapshot.docs) {
            result.push({
                name: doc.id,
                date: doc.get('date'),
            });
        }
        return result;
    } catch (error) {
        throw new ReferenceError("Schedule does not exist");
    }
};
