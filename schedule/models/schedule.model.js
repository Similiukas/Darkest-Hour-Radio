import { db } from "../../common/services/firebase.service.js";

const scheduleRef = db.collection("schedule");

export async function getScheduleData() {
    try {
        let result = [];
        const scheduleSnapshot = await scheduleRef.get();
        for (const doc of scheduleSnapshot.docs) {
            result.push({
                name: doc.id,
                date: doc.get('date'),
                priority: doc.get('priority'),
            });
        }
        return result;
    } catch (error) {
        throw new ReferenceError("Schedule does not exist");
    }
}
