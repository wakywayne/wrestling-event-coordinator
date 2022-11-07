import { ObjectId } from 'bson';
import { User, Event as Events, weightsForEvent, weightsForUserCreatedEvents, createdEvents } from 'gql';
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
const createEvent = async (event: Omit<Events, "_id" | "eventApplicants">): Promise<Events | undefined> => {

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
    const cleanEventWithoutEventApplicants = cleanUndefinedOrNullKeys<Omit<Events, "_id" | "eventApplicants">>(dirtyEventWithoutEventApplicants)

    const cleanEvent = {
        ...cleanEventWithoutEventApplicants as Omit<Events, "_id">,
        eventApplicants
    }





    // Here we define our two functions so we can later await them consecutively
    const insertEvent = async () => {
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


    const returnedEventId = await insertEvent().then((returnedId: ObjectId): ObjectId => {

        const eventWithoutId = {
            createdEventName: name,
            createdEventDate: date,
            createdEventDescription: description,
            createdEventCost: cost,
            createdEventLink: link,
        }

        // we redue the process we did earlier
        const cleanEventWithoutId = cleanUndefinedOrNullKeys<Omit<Events, "_id">>(eventWithoutId)

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
        // We return the event object
        return returnedId
    })

    return { ...cleanEvent, _id: new ObjectId(returnedEventId) }

}

const updateEvent = async (createdBy: ObjectId, event: Omit<Events, "createdBy">): Promise<Events | undefined> => {

    const eventWithCreatedBy: Events = {
        ...event,
        createdBy
    }

    const cleanEventObject = cleanUndefinedOrNullKeys<Events>(eventWithCreatedBy)

    // remove the _id from cleaned event object
    const { _id, ...cleanEventObjectWithoutId } = cleanEventObject

    // Update Event Where _id = event._id
    try {
        const client = await clientPromise;
        const db = client.db();

        const updatedEvent = await db
            .collection("events")
            .updateOne({ _id: new ObjectId(event._id) }, { $set: cleanEventObjectWithoutId });

        let { _id, name, date, description, cost, link } = cleanEventObject



        // this function updates the corresponding event in the users createdEvents array
        const updateUserCreatedEvent = async (event: createdEvents, userId: ObjectId) => {
            const client = await clientPromise;
            const db = client.db();



            const newEvent = await db
                .collection("users")
                .updateOne({ _id: new ObjectId(userId) }, { $set: { createdEvents: event } });
            // return the created event's id

            if (newEvent) {
                return true
            } else {
                throw new Error("Event not created");
            }
        }


        const eventWithId = {
            createdEventId: _id,
            createdEventName: name,
            createdEventDate: date,
            createdEventDescription: description,
            createdEventCost: cost,
            createdEventLink: link,
        }

        // we redue the process we did earlier
        const cleanEventWithId = cleanUndefinedOrNullKeys<createdEvents>(eventWithId)


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
            updateUserCreatedEvent({ ...cleanEventWithId, createdEventWeights: newEventWeights }, createdBy)
        } else {
            const newEventWeights: weightsForUserCreatedEvents[] = []
            updateUserCreatedEvent({ ...cleanEventWithId, createdEventWeights: newEventWeights }, createdBy)
        }




        if (updatedEvent) {
            return cleanEventObject;
        } else {
            throw new Error("Event not updated");
        }
    }
    catch (e) {
        console.error(e);
    }
}

// create a function that deletes an event
const deleteEvent = async (eventId: ObjectId, userId: ObjectId) => {
    try {
        const client = await clientPromise;
        const db = client.db();

        const queries = await Promise.all([
            db.collection("events").deleteOne({ _id: new ObjectId(eventId) }),
            db.collection("users").updateOne({ _id: new ObjectId(userId) },
                { $pull: { createdEvents: { createdEventId: new ObjectId(eventId) } } })
        ])



        if (queries[0].acknowledged == true && queries[1].acknowledged == true) {
            return true
        } else {
            throw new Error("Event not deleted")
        }


    } catch (e) {
        console.error(e);
    }
}



const dbMutations = {
    createUser, createEvent, updateEvent, deleteEvent,
}

export default dbMutations;
