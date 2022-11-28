import { User, Event as Events } from 'gql';
import BSON, { ObjectId } from 'bson';
import clientPromise from 'lib/mongodb';

const getUsers = async (): Promise<User[] | undefined> => {
    try {
        const client = await clientPromise;


        const users = await client.db().collection("users").find({}).limit(50).toArray();


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
        const db = client.db();

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
        const db = client.db();

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
        const db = client.db();

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


const getEventBasedOnUserWeight = async (weight: number, plusOrMinus: number = 10): Promise<Events[] | undefined> => {
    try {
        const client = await clientPromise;
        const db = client.db();

        const upperWeight = weight + plusOrMinus;
        const lowerWeight = weight - plusOrMinus;

        const events = await db
            .collection("events")
            .find({ $and: [{ "weights.weight": { $gt: lowerWeight } }, { "weights.weight": { $lt: upperWeight } }] })
            .limit(50).toArray();

        if (events) {
            return events as Events[];
        } else {
            throw new Error("No events found");
        }
    } catch (e) {
        console.error(e);
    }
};

const getEventBasedOnUserLocation = async (coordinates: number[]): Promise<Events[] | undefined> => {

    const longitude = coordinates[0];
    const latitude = coordinates[1];
    try {

        const client = await clientPromise;
        const db = client.db();

        const events = await db
            .collection("events")
            .find({ "location": { $near: { $geometry: { type: "Point", coordinates: [longitude, latitude] } } } })
            .limit(50).toArray();
        // You also have $maxDistance:40 and $minDistance:10 options

        if (events) {
            return events as Events[];
        } else {
            throw new Error("No events found");
        }
    }
    catch (e) {
        console.error(e);
    }
}



const dbQueries = {
    getEvents,
    getEventById,
    getUsers,
    getUserById,
    getEventBasedOnUserWeight,
    getEventBasedOnUserLocation
}

export default dbQueries;