import { init, Ditto } from "@dittolive/ditto"
import { calculatePosition, calculateGoalTime } from "./initialize";
import { connectDB } from "./database";


let ditto
export default async function handler(req, res) {
    ditto = await connectDB();

    let data = req.body

    switch (req.method) {
        case 'POST':
            try {
                data.position = calculatePosition(data.tableSize)
                data.goalTime = calculateGoalTime(data.position)

                const docID = await ditto.store.collection('reservations').upsert(data)

                return res.status(200).json({ success: true, message: `Entered customer ${docID} to queue` })
            } catch (e) {
                return res.status(500).json({ success: false, message: e.message })
            }
        default:
            return res.status(500).json({ success: false, message: "Only Post requests allowed" })
    }
}