import { ObjectId } from 'bson';
import { User, Event as Events, weightsForEvent, weightsForUserCreatedEvents, createdEvents, Location } from 'gql';
import { cleanUndefinedOrNullKeys } from 'utils'
import clientPromise from 'lib/mongodb';


const createUser = async (user: Omit<User, "_id">): Promise<ObjectId | undefined> => {

    // basic MongoDB query
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

interface partialEvent {
    _id: ObjectId
    createdBy: ObjectId
    name: string
    description: string
    date: Date
    cost?: string
    link?: string
    location: Location
    // mission failed we will get em next time
    weights: any
}

// create a function that creates an event
const createEvent = async (event: Omit<partialEvent, "_id" | "eventApplicants">): Promise<Events | undefined> => {

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



    // cleaning with setting the expected return type using generics
    const cleanEventWithoutEventApplicants = cleanUndefinedOrNullKeys<Omit<Events, "_id" | "eventApplicants">>(dirtyEventWithoutEventApplicants)

    const cleanEvent = {
        ...cleanEventWithoutEventApplicants as Omit<Events, "_id">,
        eventApplicants
    }





    // Here we define our two functions so we can later await them consecutively using Promise.all
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



        // Here we have to construct the weightsForUserCreatedEvents array of objects because it is different then the one on the actual event
        if (Array.isArray(eventWeights) && eventWeights.length) {
            // Here we map through the weights array and create a new array of false values we will use this in the front end later
            const newEventWeights = eventWeights.map((weight) => {
                const stringWeight = String(weight.weight)

                // we use the previous arrays length to determine how many false values we need
                const numberOfSpots = weight.spotsAvailable?.length ? weight.spotsAvailable.length : 0

                // this is the array of false values we will use in the front end 
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

// weeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee
const updateEvent = async (createdBy: ObjectId, event: Omit<partialEvent, "createdBy">): Promise<Events | undefined> => {

    // We don't want to repeate so we only pass createdBy once and use it here
    const eventWithCreatedBy: partialEvent = {
        ...event,
        createdBy
    }

    // removing the null and undefined keys
    const cleanEventObject = cleanUndefinedOrNullKeys<Events>(eventWithCreatedBy)

    // remove the _id from cleaned event object because we don't want to risk altering the id
    const { _id, ...cleanEventObjectWithoutId } = cleanEventObject

    // Update Event Where _id = event._id
    try {
        const client = await clientPromise;
        const db = client.db();

        const updatedEvent = await db
            .collection("events")
            .updateOne({ _id: new ObjectId(event._id) }, { $set: cleanEventObjectWithoutId });


        // we are going to update the user's createdEvents field as well using these values
        let { _id, name, date, description, cost, link } = cleanEventObject



        // this function updates the corresponding event in the users createdEvents array
        const updateUserCreatedEvent = async (event: createdEvents, userId: ObjectId) => {
            const client = await clientPromise;
            const db = client.db();


            // we need the id on this one because it is a reference to the event
            const eventWithConfirmedProperId: createdEvents = {
                ...event,
                createdEventId: new ObjectId(event.createdEventId)
            }


            const newEvent = await db
                .collection("users")
                .updateOne({ _id: new ObjectId(userId), "createdEvents.createdEventId": new ObjectId(_id) }, { $set: { "createdEvents.$": eventWithConfirmedProperId } });
            // return the created event's id
            // db.users.updateOne({_id: ObjectId("63669a7fadb92eac2df57fc9"), "createdEvents.createdEventId": ObjectId('636877a65c6d7c7c098baf5b')}, 
            // {$set: {"createdEvents.$":{name: "penis"}}})

            if (newEvent) {
                return
            } else {
                throw new Error("User Event not created");
            }
        }


        // Here we build the correct names for the field we are updating
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

                const numberOfSpots = weight.spotsAvailable?.length ? weight.spotsAvailable.length : 0

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



        // Here we return the full event object because that is what we will want on the front end
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

        // Here we use promises because we can do these queries in parallel
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
