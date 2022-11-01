import { User, Event as Events } from 'gql';
import BSON, { ObjectId } from 'bson';
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


const getUserById = async (id: ObjectId): Promise<User | undefined> => {
    try {
        const mongId = new ObjectId(id);

        const client = await clientPromise;
        const db = client.db("wrestling-event-planner");

        const user = await db
            .collection("users")
            .findOne({ _id: mongId });

        if (user) {
            return user as User;
        } else {
            return undefined
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



const getEventById = async (id: ObjectId): Promise<Events | undefined> => {
    try {
        const mongId = new ObjectId(id);

        const client = await clientPromise;
        const db = client.db("wrestling-event-planner");

        const event = await db
            .collection("events")
            .findOne({ _id: mongId });

        if (event) {
            return event as Events;
        } else {
            return undefined
        }
    } catch (e) {
        console.error(e);
    }
};




const dbQueries = {
    getEvents,
    getEventById,
    getUsers,
    getUserById,
}

export default dbQueries;