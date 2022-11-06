import { ObjectId } from 'bson';
import { User, Event as Events } from 'gql';
import clientPromise from 'lib/mongodb';


const createUser = async (user: Omit<User, "_id">): Promise<ObjectId | undefined> => {

    try {
        const client = await clientPromise;
        const db = client.db();

        const newUser = await db
            .collection("users")
            .insertOne(user);
        // return the created users id
        const returnedId: ObjectId = newUser.insertedId;

        if (newUser) {
            return returnedId;
        } else {
            throw new Error("User not created");
        }
    } catch (e) {
        console.error(e);
    }
}

// create a function that creates an event
const createEvent = async (event: Omit<Events, "_id">): Promise<ObjectId | undefined> => {

    const userId = event.createdBy
    const name = event.name
    const description = event.description
    const date = event.date
    const cost = event.cost


    try {
        const client = await clientPromise;
        const db = client.db();

        const newEvent = await db
            .collection("events")
            .insertOne(event);
        // return the created event's id
        const returnedId: ObjectId = newEvent.insertedId;

        if (newEvent) {
            return returnedId;
        } else {
            throw new Error("Event not created");
        }
    } catch (e) {
        console.error(e);
    }
}

// create a function that updates the user's events
const updateUserEvents = async (userId: ObjectId, eventId: ObjectId) => {

    try {
        const client = await clientPromise;
        const db = client.db();

        const updatedUser = await db
            .collection("users")
            .updateOne({ _id: userId }, { $push: { events: eventId } });
        // return the created event's id
        const returnedId: ObjectId = updatedUser.upsertedId;

        if (updatedUser) {
            return returnedId;
        } else {
            throw new Error("Event not created");
        }
    } catch (e) {
        console.error(e);
    }
}


const dbMutations = {
    createUser, createEvent,
}

export default dbMutations;
