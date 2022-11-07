import { ObjectId } from 'bson';
import { User, Event as Events, weightsForEvent, weightsForUserCreatedEvents, Event, createdEvents } from 'gql';
import { cleanUndefinedOrNullKeys } from 'utils'
import clientPromise from 'lib/mongodb';


const createUser = async (user: Omit<User, "_id">): Promise<ObjectId | undefined> => {

    try {
        const client = await clientPromise;
        const db = client.db();

        const newUser = await db
            .collection("users")
            .insertOne(user);
        // return the created users id
        const returnedId: ObjectId = new ObjectId(newUser.insertedId);

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
const createEvent = async (event: Omit<Events, "_id" | "eventApplicants">): Promise<ObjectId | undefined> => {

    const createdBy = event.createdBy
    const name = event.name
    const description = event.description
    const date = event.date
    const cost = event.cost
    const link = event.link
    const location = event.location
    const weights = event.weights
    const eventApplicants: [] = []

    // create a new event object so we can clean it of undefined and null keys
    const dirtyEventWithoutEventApplicants = {
        name,
        createdBy,
        description,
        date,
        cost,
        link,
        location,
        weights,
    }



    // cleaning
    const cleanEventWithoutEventApplicants = cleanUndefinedOrNullKeys(dirtyEventWithoutEventApplicants)

    const cleanEvent = {
        ...cleanEventWithoutEventApplicants as Omit<Events, "_id">,
        eventApplicants
    }





    // Here we define our two functions so we can later await them consecutively
    const insertEvent = async (event: Omit<Event, '_id'>) => {
        const client = await clientPromise;
        const db = client.db();

        const newEvent = await db
            .collection("events")
            .insertOne(cleanEvent);
        // return the created event's id
        const returnedId: ObjectId = newEvent.insertedId;

        if (newEvent) {
            return new ObjectId(returnedId);
        } else {
            throw new Error("Event not created");
        }
    }



    const insertUserCreatedEvent = async (event: Partial<createdEvents>, eventId: ObjectId) => {
        const client = await clientPromise;
        const db = client.db();

        const createdEventId = new ObjectId(eventId)

        const finalObject = {
            ...event,
            createdEventId
        }

        const newEvent = await db
            .collection("users")
            .updateOne({ _id: createdBy }, { $push: { createdEvents: finalObject } });
        // return the created event's id

        if (newEvent) {
            return eventId;
        } else {
            throw new Error("Event not created");
        }
    }


    return insertEvent(cleanEvent).then((returnedId: ObjectId): ObjectId => {

        const eventWithoutId = {
            createdEventName: name,
            createdEventDate: date,
            createdEventDescription: description,
            createdEventCost: cost,
            createdEventLink: link,
        }

        // we redue the process we did earlier
        const cleanEventWithoutId = cleanUndefinedOrNullKeys(eventWithoutId)

        const eventWeights: weightsForEvent[] | undefined = event.weights



        // Here we have to construct the weightsForUserCreatedEvents object because it is different then the one on the actual event
        if (Array.isArray(eventWeights) && eventWeights.length) {
            const newEventWeights = eventWeights.map((weight) => {
                const stringWeight = String(weight.weight)

                const numberOfSpots = weight.spotsAvailable.length

                const newFilledWithFalse = new Array(numberOfSpots).fill(false)

                const returnObject: weightsForUserCreatedEvents = {
                    weight: stringWeight,
                    filled: newFilledWithFalse
                }

                return returnObject

            })

            // insert new document into user's createdEvents field
            insertUserCreatedEvent({ ...cleanEventWithoutId, createdEventWeights: newEventWeights }, returnedId)
        } else {
            const newEventWeights: weightsForUserCreatedEvents[] = []
            insertUserCreatedEvent({ ...cleanEventWithoutId, createdEventWeights: newEventWeights }, returnedId)
        }
        // the front end expects the id of the created event I think we should return the event though
        return returnedId
    })

}

// create a function that deletes an event
const deleteEvent = async (eventId: ObjectId, userId: ObjectId) => {
    try {
        const client = await clientPromise;
        const db = client.db();

        console.log({ eventId, userId })

        const deleteEvent = await db.collection("events").deleteOne({ _id: new ObjectId(eventId) })

        const deleteUserCreatedEvent = await db.collection("users").updateOne({ _id: new ObjectId(userId) }, { $pull: { createdEvents: { createdEventId: new ObjectId(eventId) } } })

        if (deleteEvent && deleteUserCreatedEvent) {
            return true
        } else {
            throw new Error("Event not deleted")
        }

        // Promise.all([
        //     db.collection("events").deleteOne({ _id: eventId }),
        //     db.collection("users").updateOne({ _id: userId }, { createdEvents: { $pull: { createdEventId: eventId } } })
        //     // 
        // ]).then((arrayReturn) => {
        //     console.log(arrayReturn)
        // })
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
    createUser, createEvent, deleteEvent,
}

export default dbMutations;
