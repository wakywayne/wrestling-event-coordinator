import clientPromise from 'lib/mongodb';
import { NextApiRequest, NextApiResponse } from 'next';


const getEvents = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const client = await clientPromise;
        const db = client.db("wrestling_event_planner");

        const events = await db
            .collection("events")
            .find({})
            .toArray();

        res.json(events);
    } catch (e) {
        console.error(e);
    }
};


export default getEvents;