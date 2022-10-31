import { User, Event as Events } from 'gql';
import clientPromise from 'lib/mongodb';

const getUsers = async (): Promise<User[] | undefined> => {
    try {
        const client = await clientPromise;
        const db = client.db("wrestling-event-planner");

        const users = await db
            .collection("users")
            .find({}).limit(50)
            .toArray();


        if (users) {
            return users as User[];
        } else {
            return []
        }
    } catch (e) {
        console.error(e);
    }
};


const getEvents = async (): Promise<Events[] | undefined> => {
    try {
        const client = await clientPromise;
        const db = client.db("wrestling-event-planner");

        const events = await db
            .collection("events")
            .find({}).limit(50)
            .toArray();


        if (events) {
            return events as Events[];
        } else {
            return []
        }
    } catch (e) {
        console.error(e);
    }
};



const dbQueries = {
    getEvents,
    getUsers
}

export default dbQueries;